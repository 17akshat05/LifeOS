import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import Card from '../../components/Card';
import { Plus, TrendingUp, TrendingDown, DollarSign, Trash2, PieChart } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ResponsiveContainer, PieChart as RePie, Pie, Cell, Tooltip } from 'recharts';

const Finance = () => {
    const { transactions, addTransaction, deleteTransaction, getBalance, getIncome, getExpenses } = useFinance();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const [type, setType] = useState('expense'); // expense or income

    const handleAdd = (e) => {
        e.preventDefault();
        if (!title || !amount) return;
        const finalAmount = type === 'expense' ? -Math.abs(amount) : Math.abs(amount);
        addTransaction(title, finalAmount, category);
        setTitle('');
        setAmount('');
        setIsModalOpen(false);
    };

    // Prepare Chart Data
    const expensesByCategory = transactions
        .filter(t => t.amount < 0)
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
            return acc;
        }, {});

    const chartData = Object.keys(expensesByCategory).map(key => ({
        name: key,
        value: expensesByCategory[key]
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A855F7', '#EF4444'];

    return (
        <div style={{ padding: '20px', paddingBottom: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Finance</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{ background: 'var(--color-finance)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}
                >
                    <Plus size={24} color="white" />
                </button>
            </div>

            {/* Balance Card */}
            <Card style={{ padding: '24px', marginBottom: '16px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(0,0,0,0))' }}>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Balance</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>${getBalance().toFixed(2)}</div>
                <div style={{ display: 'flex', gap: '24px', marginTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '6px', borderRadius: '50%' }}><TrendingUp size={16} color="#10B981" /></div>
                        <div>
                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Income</div>
                            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>${getIncome().toFixed(2)}</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '6px', borderRadius: '50%' }}><TrendingDown size={16} color="#EF4444" /></div>
                        <div>
                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Expenses</div>
                            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>${getExpenses().toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Chart */}
            {chartData.length > 0 && (
                <Card style={{ height: '200px', marginBottom: '16px', padding: '16px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ flex: 1, height: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RePie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={40}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                ))}
                            </RePie>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ width: '120px', fontSize: '12px' }}>
                        {chartData.map((d, i) => (
                            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                                <span style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Transactions */}
            <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Recent Transactions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {transactions.map(t => (
                    <Card key={t.id} style={{ display: 'flex', alignItems: 'center', padding: '16px', gap: '16px' }}>
                        <div style={{
                            background: t.amount > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            padding: '10px',
                            borderRadius: '12px'
                        }}>
                            {t.amount > 0 ? <TrendingUp size={20} color="#10B981" /> : <TrendingDown size={20} color="#EF4444" />}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '500' }}>{t.title}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{t.category} • {format(parseISO(t.date), 'MMM d')}</div>
                        </div>
                        <div style={{ fontWeight: 'bold', color: t.amount > 0 ? '#10B981' : 'white' }}>
                            {t.amount > 0 ? '+' : ''}{t.amount.toFixed(2)}
                        </div>
                        <button onClick={() => deleteTransaction(t.id)} style={{ background: 'none', border: 'none', color: '#EF4444', opacity: 0.5 }}>
                            <Trash2 size={16} />
                        </button>
                    </Card>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.6)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'end',
                    justifyContent: 'center'
                }} onClick={() => setIsModalOpen(false)}>
                    <div
                        onClick={e => e.stopPropagation()}
                        className="glass-card"
                        style={{ width: '100%', maxWidth: '500px', padding: '24px', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
                    >
                        <h2 style={{ marginBottom: '20px' }}>Add Transaction</h2>
                        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" onClick={() => setType('expense')} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: type === 'expense' ? '#EF4444' : 'transparent', color: 'white' }}>Expense</button>
                                <button type="button" onClick={() => setType('income')} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: type === 'income' ? '#10B981' : 'transparent', color: 'white' }}>Income</button>
                            </div>
                            <input
                                type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)}
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '12px', color: 'white' }}
                            />
                            <input
                                type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)}
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '12px', color: 'white' }}
                            />
                            <select
                                value={category} onChange={e => setCategory(e.target.value)}
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '12px', color: 'white' }}
                            >
                                {type === 'expense' ? (
                                    <>
                                        <option value="Food" style={{ color: 'black' }}>Food</option>
                                        <option value="Transport" style={{ color: 'black' }}>Transport</option>
                                        <option value="Shopping" style={{ color: 'black' }}>Shopping</option>
                                        <option value="Health" style={{ color: 'black' }}>Health</option>
                                        <option value="Bills" style={{ color: 'black' }}>Bills</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="Salary" style={{ color: 'black' }}>Salary</option>
                                        <option value="Freelance" style={{ color: 'black' }}>Freelance</option>
                                        <option value="Gift" style={{ color: 'black' }}>Gift</option>
                                    </>
                                )}
                            </select>
                            <button type="submit" style={{ background: 'var(--color-finance)', color: 'white', padding: '16px', borderRadius: '16px', border: 'none', fontWeight: 'bold' }}>Add</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Finance;
