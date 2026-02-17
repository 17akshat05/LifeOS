import React, { createContext, useContext } from 'react';
import useDataSync from '../hooks/useDataSync';
import { v4 as uuidv4 } from 'uuid';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
    const [transactions, setTransactions] = useDataSync('lifeos_finance', [
        { id: 't1', title: 'Groceries', amount: -45.50, category: 'Food', date: new Date().toISOString() },
        { id: 't2', title: 'Salary', amount: 3200, category: 'Income', date: new Date().toISOString() },
        { id: 't3', title: 'Gym Membership', amount: -50, category: 'Health', date: new Date().toISOString() },
    ]);

    const addTransaction = (title, amount, category) => {
        const newTransaction = {
            id: uuidv4(),
            title,
            amount: parseFloat(amount),
            category,
            date: new Date().toISOString()
        };
        setTransactions(prev => [newTransaction, ...prev]);
    };

    const deleteTransaction = (id) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    const getBalance = () => transactions.reduce((acc, t) => acc + t.amount, 0);

    const getIncome = () => transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);

    const getExpenses = () => transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);

    return (
        <FinanceContext.Provider value={{ transactions, addTransaction, deleteTransaction, getBalance, getIncome, getExpenses }}>
            {children}
        </FinanceContext.Provider>
    );
};
