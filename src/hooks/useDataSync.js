import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import useLocalStorage from './useLocalStorage';

const useDataSync = (key, initialValue) => {
    const { user, loading } = useUser();

    // Always maintain a local copy for immediate UI updates and offline fallback
    const [localValue, setLocalValue] = useLocalStorage(key, initialValue);
    const [syncedValue, setSyncedValue] = useState(localValue);

    // Effect to sync from Firestore when logged in
    useEffect(() => {
        if (loading) return;

        if (user) {
            // Subscribe to Firestore data
            // Structure: users/{uid}/data/{key} (where key is like 'planner', 'finance', etc.)
            // We strip 'lifeos_' prefix if present to keep paths clean
            const docKey = key.replace('lifeos_', '');
            const docRef = doc(db, 'users', user.uid, 'data', docKey);

            const unsubscribe = onSnapshot(docRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    // Merge strategy: Server wins for now, or just replace
                    // For more complex apps, we might do deep merge
                    console.log(`Synced ${key} from server`);
                    setSyncedValue(data.content);
                    // Also update local storage to keep it fresh
                    if (typeof window !== 'undefined') {
                        window.localStorage.setItem(key, JSON.stringify(data.content));
                    }
                } else {
                    // Document doesn't exist yet on server, create it from local
                    setDoc(docRef, { content: localValue }, { merge: true });
                }
            });

            return () => unsubscribe();
        } else {
            // If logged out, just use local value
            setSyncedValue(localValue);
        }
    }, [user, loading, key]);

    // Custom setter that updates both Local and (if logged in) Firestore
    const setValue = async (value) => {
        // 1. Update state immediately (Optimistic UI)
        const newValue = value instanceof Function ? value(syncedValue) : value;
        setSyncedValue(newValue);
        setLocalValue(newValue); // Persist locally

        // 2. Sync to Firestore if user is logged in
        if (user) {
            try {
                const docKey = key.replace('lifeos_', '');
                const docRef = doc(db, 'users', user.uid, 'data', docKey);
                await setDoc(docRef, { content: newValue }, { merge: true });
            } catch (error) {
                console.error(`Error syncing ${key} to Firestore:`, error);
            }
        }
    };

    return [syncedValue, setValue];
};

export default useDataSync;
