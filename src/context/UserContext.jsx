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
        // Failsafe: If Firebase takes too long, stop loading so user sees something (e.g. Login or Onboarding)
        const safetyTimer = setTimeout(() => setLoading(false), 5000);

        if (!auth) {
            console.error("Auth instance is null. Firebase config might be missing.");
            setLoading(false);
            clearTimeout(safetyTimer);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            // Note: We do NOT clear safetyTimer here yet. We wait for data.
            setUser(currentUser);

            if (currentUser) {
                const userRef = doc(db, 'users', currentUser.uid);
                const unsubData = onSnapshot(userRef, (docSnap) => {
                    // Data loaded! NOW we are safe.
                    clearTimeout(safetyTimer);

                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                        checkDailyStreak(docSnap.data(), userRef);
                    } else {
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
                    setLoading(false);
                });
            } else {
                // No user, we are done loading
                clearTimeout(safetyTimer);
                setUserData({ xp: 0, level: 1, streak: 0, lastLogin: null });
                setLoading(false);
            }
        });
        return () => {
            unsubscribe();
            clearTimeout(safetyTimer);
        };
    }, []);

    // Daily Streak Logic
    const checkDailyStreak = async (data, userRef) => {
        if (!data.lastLogin) return;

        const lastLoginDate = new Date(data.lastLogin);
        const today = new Date();

        // Sanity Check: If stats are broken (infinite loop artifact), reset them
        // This is a one-time fix for existing users affected by the bug
        if (data.streak > 3650 || data.xp > 100000) {
            console.log("Detecting corrupted data, resetting stats...");
            await updateDoc(userRef, {
                streak: 1,
                xp: 0,
                level: 1,
                lastLogin: today.toISOString()
            });
            return;
        }

        // Compare calendar dates (ignore time)
        const isSameDay = lastLoginDate.toDateString() === today.toDateString();

        if (isSameDay) {
            return; // Already logged in today, do nothing
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = lastLoginDate.toDateString() === yesterday.toDateString();

        if (isYesterday) {
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
        } else {
            // Streak broken (missed a day or more)
            // Note: We use > comparison for days, but if it's not today and not yesterday, it's broken.
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
