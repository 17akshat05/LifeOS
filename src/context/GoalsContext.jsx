import React, { createContext, useContext } from 'react';
import useDataSync from '../hooks/useDataSync';
import { v4 as uuidv4 } from 'uuid';

const GoalsContext = createContext();

export const useGoals = () => useContext(GoalsContext);

export const GoalsProvider = ({ children }) => {
    const [goals, setGoals] = useDataSync('lifeos_goals', [
        {
            id: 'g1',
            title: 'Buy a House',
            targetDate: '2028-01-01',
            progress: 25,
            milestones: [
                { id: 'm1', title: 'Save $50k', completed: true },
                { id: 'm2', title: 'Improve Credit Score', completed: false }
            ]
        }
    ]);

    const addGoal = (title, targetDate) => {
        const newGoal = {
            id: uuidv4(),
            title,
            targetDate,
            progress: 0,
            milestones: []
        };
        setGoals(prev => [...prev, newGoal]);
    };

    const addMilestone = (goalId, title) => {
        setGoals(prev => prev.map(g => {
            if (g.id === goalId) {
                return { ...g, milestones: [...g.milestones, { id: uuidv4(), title, completed: false }] };
            }
            return g;
        }));
    };

    const toggleMilestone = (goalId, milestoneId) => {
        setGoals(prev => prev.map(g => {
            if (g.id === goalId) {
                const updatedMilestones = g.milestones.map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m);
                const completedCount = updatedMilestones.filter(m => m.completed).length;
                const progress = updatedMilestones.length > 0 ? (completedCount / updatedMilestones.length) * 100 : 0;
                return { ...g, milestones: updatedMilestones, progress };
            }
            return g;
        }));
    };

    const deleteGoal = (id) => {
        setGoals(prev => prev.filter(g => g.id !== id));
    };

    return (
        <GoalsContext.Provider value={{ goals, addGoal, addMilestone, toggleMilestone, deleteGoal }}>
            {children}
        </GoalsContext.Provider>
    );
};
