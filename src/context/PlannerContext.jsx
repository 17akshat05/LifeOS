import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useUser } from './UserContext';

const PlannerContext = createContext();

export const usePlanner = () => useContext(PlannerContext);

export const PlannerProvider = ({ children }) => {
    const { user } = useUser();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Sync Tasks
    useEffect(() => {
        if (!user) {
            setTasks([]);
            setLoading(false);
            return;
        }

        const q = query(collection(db, 'users', user.uid, 'tasks'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTasks(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user]);

    const addTask = async (title, description, priority = 'medium', date = new Date()) => {
        if (!user) return;
        await addDoc(collection(db, 'users', user.uid, 'tasks'), {
            title,
            description,
            priority,
            completed: false,
            date: date.toISOString(),
            createdAt: new Date().toISOString()
        });
    };

    const toggleTask = async (id) => {
        if (!user) return;
        const task = tasks.find(t => t.id === id);
        if (task) {
            await updateDoc(doc(db, 'users', user.uid, 'tasks', id), { completed: !task.completed });
        }
    };

    const deleteTask = async (id) => {
        if (!user) return;
        await deleteDoc(doc(db, 'users', user.uid, 'tasks', id));
    };

    const updateTask = async (id, updates) => {
        if (!user) return;
        await updateDoc(doc(db, 'users', user.uid, 'tasks', id), updates);
    };

    return (
        <PlannerContext.Provider value={{ tasks, loading, addTask, toggleTask, deleteTask, updateTask }}>
            {children}
        </PlannerContext.Provider>
    );
};
