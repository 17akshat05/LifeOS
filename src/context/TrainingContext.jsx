import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useUser } from './UserContext';
import { v4 as uuidv4 } from 'uuid';

const TrainingContext = createContext();

export const useTraining = () => useContext(TrainingContext);

export const TrainingProvider = ({ children }) => {
    const { user } = useUser();
    const [routines, setRoutines] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Sync Routines & History
    useEffect(() => {
        if (!user) {
            setRoutines([]);
            setHistory([]);
            setLoading(false);
            return;
        }

        // 1. Sync Routines
        const unsubRoutines = onSnapshot(collection(db, 'users', user.uid, 'routines'), (snapshot) => {
            setRoutines(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // 2. Sync History
        const qHistory = query(collection(db, 'users', user.uid, 'training_history'), orderBy('date', 'desc'));
        const unsubHistory = onSnapshot(qHistory, (snapshot) => {
            setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        setLoading(false);
        return () => {
            unsubRoutines();
            unsubHistory();
        };
    }, [user]);

    const addRoutine = async (name, exercises) => {
        if (!user) return;
        await addDoc(collection(db, 'users', user.uid, 'routines'), {
            name,
            exercises
        });
    };

    const updateRoutine = async (id, updatedRoutine) => {
        if (!user) return;
        await updateDoc(doc(db, 'users', user.uid, 'routines', id), updatedRoutine);
    };

    const deleteRoutine = async (id) => {
        if (!user) return;
        await deleteDoc(doc(db, 'users', user.uid, 'routines', id));
    };

    const logWorkout = async (routineId, duration, exercisesCompleted) => {
        if (!user) return;
        await addDoc(collection(db, 'users', user.uid, 'training_history'), {
            routineId,
            date: new Date().toISOString(),
            duration,
            exercises: exercisesCompleted
        });
    };

    // XP Calculation
    const getXP = () => {
        // 50 XP per workout + 10 XP per exercise
        return history.reduce((acc, log) => acc + 50 + (log.exercises?.length || 0) * 10, 0);
    };

    const getLevel = () => {
        const xp = getXP();
        return Math.floor(Math.sqrt(xp / 100)) + 1;
    };

    return (
        <TrainingContext.Provider value={{ routines, history, loading, addRoutine, updateRoutine, deleteRoutine, logWorkout, getXP, getLevel }}>
            {children}
        </TrainingContext.Provider>
    );
};
