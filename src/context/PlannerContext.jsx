import React, { createContext, useContext } from 'react';
import useDataSync from '../hooks/useDataSync';
import { v4 as uuidv4 } from 'uuid';

const PlannerContext = createContext();

export const usePlanner = () => useContext(PlannerContext);

export const PlannerProvider = ({ children }) => {
    const [tasks, setTasks] = useDataSync('lifeos_tasks', []);

    const addTask = (title, description, priority = 'medium', date = new Date()) => {
        const newTask = {
            id: uuidv4(),
            title,
            description,
            priority,
            completed: false,
            date: date.toISOString(), // Store as string
            createdAt: new Date().toISOString()
        };
        setTasks((prev) => [...prev, newTask]);
    };

    const toggleTask = (id) => {
        setTasks((prev) =>
            prev.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const deleteTask = (id) => {
        setTasks((prev) => prev.filter(task => task.id !== id));
    };

    const updateTask = (id, updates) => {
        setTasks((prev) =>
            prev.map(task =>
                task.id === id ? { ...task, ...updates } : task
            )
        );
    };

    // Reordering would go here (requires logic dependent on drag-and-drop lib or manual splice)

    const value = {
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        updateTask
    };

    return (
        <PlannerContext.Provider value={value}>
            {children}
        </PlannerContext.Provider>
    );
};
