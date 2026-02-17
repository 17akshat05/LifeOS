import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useUser } from './UserContext';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
    const { user } = useUser();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Real-time Sync with Firestore
    useEffect(() => {
        if (!user) {
            setTransactions([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'users', user.uid, 'transactions'),
            orderBy('date', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTransactions(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching transactions:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addTransaction = async (title, amount, category, type) => {
        if (!user) return;

        // Ensure amount sign is correct based on type
        const finalAmount = type === 'expense' ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));

        await addDoc(collection(db, 'users', user.uid, 'transactions'), {
            title,
            amount: finalAmount,
            category,
            type,
            date: new Date().toISOString()
        });
    };

    const deleteTransaction = async (id) => {
        if (!user) return;
        await deleteDoc(doc(db, 'users', user.uid, 'transactions', id));
    };

    const updateTransaction = async (id, updates) => {
        if (!user) return;
        await updateDoc(doc(db, 'users', user.uid, 'transactions', id), updates);
    };

    const getBalance = () => transactions.reduce((acc, t) => acc + t.amount, 0);

    const getIncome = () => transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);

    const getExpenses = () => transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);

    return (
        <FinanceContext.Provider value={{
            transactions,
            loading,
            addTransaction,
            deleteTransaction,
            updateTransaction,
            getBalance,
            getIncome,
            getExpenses
        }}>
            {children}
        </FinanceContext.Provider>
    );
};
