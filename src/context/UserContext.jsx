import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc, updateDoc, increment, getDoc } from 'firebase/firestore';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState({
        xp: 0,
        level: 1,
        streak: 0,
        lastLogin: null
    });
    const [loading, setLoading] = useState(true);

    // Auth Listener
    useEffect(() => {
        if (!auth) {
            console.error("Auth instance is null. Firebase config might be missing.");
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Subscribe to user data in Firestore
                const userRef = doc(db, 'users', currentUser.uid);
                const unsubData = onSnapshot(userRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                        checkDailyStreak(docSnap.data(), userRef);
                    } else {
                        // Initialize new user
                        const initialData = {
                            phoneNumber: currentUser.phoneNumber || currentUser.email || 'Anonymous',
                            xp: 0,
                            level: 1,
                            streak: 1,
                            lastLogin: new Date().toISOString()
                        };
                        setDoc(userRef, initialData);
                        setUserData(initialData);
                    }
                });
                return () => unsubData();
            } else {
                setUserData({ xp: 0, level: 1, streak: 0, lastLogin: null });
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Daily Streak Logic
    const checkDailyStreak = async (data, userRef) => {
        if (!data.lastLogin) return;
        const lastLogin = new Date(data.lastLogin);
        const today = new Date();
        const diffTime = Math.abs(today - lastLogin);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Consecutive day login
            // Sunday Bonus (0 = Sunday)
            let bonus = 0;
            if (today.getDay() === 0 && data.streak >= 6) {
                bonus = Math.floor(Math.random() * 500) + 100; // 100-600 XP
            }

            // Weekly streak reward
            const dayReward = 10 * ((data.streak % 7) + 1);
            const totalReward = dayReward + bonus;

            await updateDoc(userRef, {
                streak: increment(1),
                lastLogin: today.toISOString(),
                xp: increment(totalReward)
            });
        } else if (diffDays > 1) {
            // Streak broken
            await updateDoc(userRef, {
                streak: 1,
                lastLogin: today.toISOString()
            });
        }
    };

    // XP & Leveling Logic
    const addXP = async (amount) => {
        if (!user) return; // offline xp not yet supported or local only

        const userRef = doc(db, 'users', user.uid);
        // Optimistic update? Better to wait for server or use atomic increment
        await updateDoc(userRef, {
            xp: increment(amount)
        });

        // Check level up logic happens in component or cloud function? 
        // For client-side simplicity, we recalculate level based on new XP
        const newXP = userData.xp + amount; // approximate
        const newLevel = calculateLevel(newXP);
        if (newLevel > userData.level) {
            await updateDoc(userRef, { level: newLevel });
            // TODO: Trigger level up animation
        }
    };

    const calculateLevel = (xp) => {
        // Lvl 1-50: 100 XP/lvl (Cumulative: 50 * 100 = 5000)
        if (xp < 5000) return Math.floor(xp / 100) + 1;

        // Lvl 51-100: 300 XP/lvl
        // XP = 5000 + (lvl-50)*300
        if (xp < 5000 + 50 * 300) return 50 + Math.floor((xp - 5000) / 300);

        // Lvl 101-150: 1000 XP/lvl
        if (xp < 20000 + 50 * 1000) return 100 + Math.floor((xp - 20000) / 1000);

        // Lvl 151-300: 5000 XP/lvl
        return 150 + Math.floor((xp - 70000) / 5000);
    };

    const logout = () => signOut(auth);

    if (!auth) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'white', background: '#09090b', padding: '20px', textAlign: 'center' }}>
                <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>Configuration Error</h1>
                <p>Firebase is not initialized.</p>
                <p style={{ opacity: 0.7, fontSize: '0.9rem', marginTop: '0.5rem' }}>Please check that your <code>.env</code> file exists and has the correct keys.</p>
            </div>
        );
    }

    return (
        <UserContext.Provider value={{ user, userData, loading, addXP, logout }}>
            {children}
        </UserContext.Provider>
    );
};
