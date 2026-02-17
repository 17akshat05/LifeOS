import React, { createContext, useContext } from 'react';
import useDataSync from '../hooks/useDataSync';
import { v4 as uuidv4 } from 'uuid';

const TrainingContext = createContext();

export const useTraining = () => useContext(TrainingContext);

export const TrainingProvider = ({ children }) => {
    const [routines, setRoutines] = useDataSync('lifeos_routines', [
        {
            id: 'default-1',
            name: 'Full Body A',
            exercises: [
                { id: 'ex-1', name: 'Squat', sets: 3, reps: '8-10' },
                { id: 'ex-2', name: 'Bench Press', sets: 3, reps: '8-10' },
                { id: 'ex-3', name: 'Rows', sets: 3, reps: '10-12' }
            ]
        }
    ]);

    const [history, setHistory] = useDataSync('lifeos_training_history', []);

    const addRoutine = (name, exercises) => {
        const newRoutine = { id: uuidv4(), name, exercises };
        setRoutines(prev => [...prev, newRoutine]);
    };

    const updateRoutine = (id, updatedRoutine) => {
        setRoutines(prev => prev.map(r => r.id === id ? { ...r, ...updatedRoutine } : r));
    };

    const deleteRoutine = (id) => {
        setRoutines(prev => prev.filter(r => r.id !== id));
    };

    const logWorkout = (routineId, duration, exercisesCompleted) => {
        const newLog = {
            id: uuidv4(),
            routineId,
            date: new Date().toISOString(),
            duration,
            exercises: exercisesCompleted
        };
        setHistory(prev => [newLog, ...prev]);
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
        <TrainingContext.Provider value={{ routines, history, addRoutine, updateRoutine, deleteRoutine, logWorkout, getXP, getLevel }}>
            {children}
        </TrainingContext.Provider>
    );
};
