import React, { createContext, useContext } from 'react';
import useDataSync from '../hooks/useDataSync';
import { v4 as uuidv4 } from 'uuid';

const ReflectionContext = createContext();

export const useReflection = () => useContext(ReflectionContext);

export const ReflectionProvider = ({ children }) => {
    const [entries, setEntries] = useDataSync('lifeos_reflection', [
        {
            id: 'r1',
            date: new Date().toISOString(),
            mood: 'happy',
            gratitude: 'Family, Coffee, Code',
            journal: 'Today was a productive day. I built a lot of features.'
        }
    ]);

    const addEntry = (mood, gratitude, journal) => {
        const newEntry = {
            id: uuidv4(),
            date: new Date().toISOString(),
            mood,
            gratitude,
            journal
        };
        // Check if entry already exists for today? For now just append.
        setEntries(prev => [newEntry, ...prev]);
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
        <ReflectionContext.Provider value={{ entries, addEntry, getMoodEmoji }}>
            {children}
        </ReflectionContext.Provider>
    );
};
