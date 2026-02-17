import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import Card from '../../components/Card';
import { Plus, TrendingUp, TrendingDown, Trash2, Edit2, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ResponsiveContainer, PieChart as RePie, Pie, Cell } from 'recharts';

const Finance = () => {
    const { transactions, addTransaction, deleteTransaction, updateTransaction, getBalance, getIncome, getExpenses } = useFinance();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form State
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const [type, setType] = useState('expense'); // expense or income

    const openAddModal = () => {
        setEditingId(null);
        setTitle('');
        setAmount('');
        setCategory('Food');
        setType('expense');
        setIsModalOpen(true);
    };

    const openEditModal = (t) => {
        setEditingId(t.id);
        setTitle(t.title);
        setAmount(Math.abs(t.amount).toString());
        setCategory(t.category);
        setType(t.amount >= 0 ? 'income' : 'expense');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !amount) return;

        if (editingId) {
            // Edit Mode
            const finalAmount = type === 'expense' ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));
            await updateTransaction(editingId, {
                title,
                amount: finalAmount,
                category,
                type
            });
        } else {
            // Add Mode
            await addTransaction(title, amount, category, type);
        }

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
                    onClick={openAddModal}
                    style={{ background: 'var(--color-finance)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', cursor: 'pointer' }}
                >
                    <Plus size={24} color="white" />
                </button>
            </div>

            {/* Balance Card */}
            <Card style={{ padding: '24px', marginBottom: '16px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(0,0,0,0))' }}>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Balance</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>₹{getBalance().toFixed(2)}</div>
                <div style={{ display: 'flex', gap: '24px', marginTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '6px', borderRadius: '50%' }}><TrendingUp size={16} color="#10B981" /></div>
                        <div>
                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Income</div>
                            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>₹{getIncome().toFixed(2)}</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '6px', borderRadius: '50%' }}><TrendingDown size={16} color="#EF4444" /></div>
                        <div>
                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Expenses</div>
                            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>₹{getExpenses().toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Chart */}
            {chartData.length > 0 && (
                <Card style={{ height: '220px', marginBottom: '16px', padding: '16px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ flex: 1, height: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RePie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={40} paddingAngle={5}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </RePie>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ width: '120px', fontSize: '12px' }}>
                        {chartData.map((d, i) => (
                            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                                    <span style={{ fontWeight: 'bold' }}>₹{d.value.toFixed(0)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Transactions */}
            <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Recent Transactions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {transactions.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No transactions yet</div>
                ) : (
                    transactions.map(t => (
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
                            <div style={{ fontWeight: 'bold', color: t.amount > 0 ? '#10B981' : 'white', marginRight: '8px' }}>
                                {t.amount > 0 ? '+' : ''}{t.amount.toFixed(2)}
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => openEditModal(t)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => deleteTransaction(t.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Optimized Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'end',
                    justifyContent: 'center',
                    backdropFilter: 'blur(4px)'
                }} onClick={() => setIsModalOpen(false)}>
                    <div
                        onClick={e => e.stopPropagation()}
                        className="glass-card animate-slide-up"
                        style={{ width: '100%', maxWidth: '500px', padding: '24px', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderRadius: '24px 24px 0 0' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{editingId ? 'Edit Transaction' : 'Add Transaction'}</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '14px' }}>
                                <button type="button" onClick={() => setType('expense')} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: type === 'expense' ? '#EF4444' : 'transparent', color: type === 'expense' ? 'white' : 'var(--text-secondary)', fontWeight: '600', transition: 'all 0.2s' }}>Expense</button>
                                <button type="button" onClick={() => setType('income')} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: type === 'income' ? '#10B981' : 'transparent', color: type === 'income' ? 'white' : 'var(--text-secondary)', fontWeight: '600', transition: 'all 0.2s' }}>Income</button>
                            </div>

                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Title</label>
                                <input
                                    type="text" placeholder="e.g. Grocery Shopping" value={title} onChange={e => setTitle(e.target.value)}
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '16px', color: 'white', fontSize: '16px' }}
                                    required
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Amount (₹)</label>
                                <input
                                    type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)}
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '16px', color: 'white', fontSize: '16px' }}
                                    required
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Category</label>
                                <select
                                    value={category} onChange={e => setCategory(e.target.value)}
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '16px', color: 'white', fontSize: '16px' }}
                                >
                                    {type === 'expense' ? (
                                        <>
                                            <option value="Food" style={{ color: 'black' }}>🍔 Food & Dining</option>
                                            <option value="Transport" style={{ color: 'black' }}>🚗 Transport</option>
                                            <option value="Shopping" style={{ color: 'black' }}>🛍️ Shopping</option>
                                            <option value="Health" style={{ color: 'black' }}>💊 Health</option>
                                            <option value="Bills" style={{ color: 'black' }}>🧾 Bills & Utilities</option>
                                            <option value="Entertainment" style={{ color: 'black' }}>🎬 Entertainment</option>
                                            <option value="Other" style={{ color: 'black' }}>🔌 Other</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="Salary" style={{ color: 'black' }}>💰 Salary</option>
                                            <option value="Freelance" style={{ color: 'black' }}>💻 Freelance</option>
                                            <option value="Gift" style={{ color: 'black' }}>🎁 Gift</option>
                                            <option value="Investments" style={{ color: 'black' }}>📈 Investments</option>
                                            <option value="Other" style={{ color: 'black' }}>🔌 Other</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            <button type="submit" style={{ background: 'var(--color-finance)', color: 'white', padding: '16px', borderRadius: '16px', border: 'none', fontWeight: 'bold', fontSize: '16px', marginTop: '8px' }}>
                                {editingId ? 'Save Changes' : 'Add Transaction'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Finance;
