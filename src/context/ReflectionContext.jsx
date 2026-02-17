import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useUser } from './UserContext';

const ReflectionContext = createContext();

export const useReflection = () => useContext(ReflectionContext);

export const ReflectionProvider = ({ children }) => {
    const { user } = useUser();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    // Sync Reflections
    useEffect(() => {
        if (!user) {
            setEntries([]);
            setLoading(false);
            return;
        }

        const q = query(collection(db, 'users', user.uid, 'reflections'), orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user]);

    const addEntry = async (mood, gratitude, journal) => {
        if (!user) return;
        await addDoc(collection(db, 'users', user.uid, 'reflections'), {
            date: new Date().toISOString(),
            mood,
            gratitude,
            journal
        });
    };

    const getMoodEmoji = (mood) => {
        const moods = {
            happy: '😊',
            excited: '🤩',
            neutral: '😐',
            sad: '😔',
            stressed: '😫'
        };
        return moods[mood] || '😐';
    };

    return (
        <ReflectionContext.Provider value={{ entries, loading, addEntry, getMoodEmoji }}>
            {children}
        </ReflectionContext.Provider>
    );
};
