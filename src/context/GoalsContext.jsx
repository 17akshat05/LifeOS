import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useUser } from './UserContext';
import { v4 as uuidv4 } from 'uuid'; // Keep for milestones IDs inside the doc

const GoalsContext = createContext();

export const useGoals = () => useContext(GoalsContext);

export const GoalsProvider = ({ children }) => {
    const { user } = useUser();
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Sync Goals
    useEffect(() => {
        if (!user) {
            setGoals([]);
            setLoading(false);
            return;
        }

        const q = query(collection(db, 'users', user.uid, 'goals'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setGoals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user]);

    const addGoal = async (title, targetDate) => {
        if (!user) return;
        await addDoc(collection(db, 'users', user.uid, 'goals'), {
            title,
            targetDate,
            progress: 0,
            milestones: []
        });
    };

    const addMilestone = async (goalId, title) => {
        if (!user) return;
        const goal = goals.find(g => g.id === goalId);
        if (goal) {
            const newMilestones = [...goal.milestones, { id: uuidv4(), title, completed: false }];
            const completedCount = newMilestones.filter(m => m.completed).length;
            const progress = (completedCount / newMilestones.length) * 100;

            await updateDoc(doc(db, 'users', user.uid, 'goals', goalId), {
                milestones: newMilestones,
                progress
            });
        }
    };

    const toggleMilestone = async (goalId, milestoneId) => {
        if (!user) return;
        const goal = goals.find(g => g.id === goalId);
        if (goal) {
            const updatedMilestones = goal.milestones.map(m =>
                m.id === milestoneId ? { ...m, completed: !m.completed } : m
            );
            const completedCount = updatedMilestones.filter(m => m.completed).length;
            const progress = updatedMilestones.length > 0 ? (completedCount / updatedMilestones.length) * 100 : 0;

            await updateDoc(doc(db, 'users', user.uid, 'goals', goalId), {
                milestones: updatedMilestones,
                progress
            });
        }
    };

    const deleteGoal = async (id) => {
        if (!user) return;
        await deleteDoc(doc(db, 'users', user.uid, 'goals', id));
    };

    return (
        <GoalsContext.Provider value={{ goals, loading, addGoal, addMilestone, toggleMilestone, deleteGoal }}>
            {children}
        </GoalsContext.Provider>
    );
};
