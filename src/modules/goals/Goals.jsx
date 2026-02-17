import React, { useState } from 'react';
import { useGoals } from '../../context/GoalsContext';
import Card from '../../components/Card';
import { Plus, Target, Calendar, CheckSquare, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';
import clsx from 'clsx';

const Goals = () => {
    const { goals, addGoal, addMilestone, toggleMilestone, deleteGoal } = useGoals();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [expandedGoal, setExpandedGoal] = useState(null);
    const [newMilestone, setNewMilestone] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if (!title || !date) return;
        addGoal(title, date);
        setTitle('');
        setDate('');
        setIsModalOpen(false);
    };

    const handleAddMilestone = (goalId) => {
        if (!newMilestone.trim()) return;
        addMilestone(goalId, newMilestone);
        setNewMilestone('');
    };

    return (
        <div style={{ padding: '20px', paddingBottom: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Goals</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{ background: 'var(--color-goals)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)' }}
                >
                    <Plus size={24} color="white" />
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {goals.map(goal => {
                    const daysLeft = differenceInDays(parseISO(goal.targetDate), new Date());
                    const isExpanded = expandedGoal === goal.id;

                    return (
                        <Card key={goal.id} style={{ padding: '20px', transition: 'all 0.3s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>{goal.title}</h3>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Calendar size={12} /> {daysLeft > 0 ? `${daysLeft} days left` : 'Due today'}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-goals)' }}>{Math.round(goal.progress)}%</span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', marginBottom: '16px' }}>
                                <div style={{ height: '100%', width: `${goal.progress}%`, background: 'var(--color-goals)', transition: 'width 0.5s ease' }} />
                            </div>

                            <button
                                onClick={() => setExpandedGoal(isExpanded ? null : goal.id)}
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: 'none', padding: '8px', borderRadius: '8px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                            >
                                {isExpanded ? 'Hide Milestones' : 'View Milestones'}
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>

                            {isExpanded && (
                                <div style={{ marginTop: '16px', animation: 'fadeIn 0.3s ease' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                                        {goal.milestones.map(m => (
                                            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                                                <button
                                                    onClick={() => toggleMilestone(goal.id, m.id)}
                                                    style={{
                                                        width: '20px', height: '20px', borderRadius: '4px',
                                                        border: `2px solid ${m.completed ? 'var(--color-goals)' : 'var(--text-secondary)'}`,
                                                        background: m.completed ? 'var(--color-goals)' : 'transparent',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, cursor: 'pointer'
                                                    }}
                                                >
                                                    {m.completed && <CheckSquare size={12} color="white" />}
                                                </button>
                                                <span style={{ flex: 1, textDecoration: m.completed ? 'line-through' : 'none', color: m.completed ? 'var(--text-secondary)' : 'white' }}>{m.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input
                                            type="text"
                                            placeholder="Add milestone..."
                                            value={newMilestone}
                                            onChange={e => setNewMilestone(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleAddMilestone(goal.id)}
                                            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '8px', borderRadius: '8px', color: 'white', outline: 'none' }}
                                        />
                                        <button onClick={() => handleAddMilestone(goal.id)} style={{ background: 'var(--color-goals)', border: 'none', borderRadius: '8px', padding: '0 12px', color: 'white' }}>
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <button onClick={() => deleteGoal(goal.id)} style={{ marginTop: '16px', width: '100%', color: '#EF4444', background: 'transparent', border: '1px solid #EF4444', padding: '8px', borderRadius: '8px', opacity: 0.7 }}>
                                        Delete Goal
                                    </button>
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>

            {/* Add Goal Modal */}
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
                        <h2 style={{ marginBottom: '20px' }}>New Goal</h2>
                        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <input
                                type="text" placeholder="Goal Title" value={title} onChange={e => setTitle(e.target.value)}
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '12px', color: 'white' }}
                            />
                            <input
                                type="date" value={date} onChange={e => setDate(e.target.value)}
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '12px', color: 'white' }}
                            />
                            <button type="submit" style={{ background: 'var(--color-goals)', color: 'white', padding: '16px', borderRadius: '16px', border: 'none', fontWeight: 'bold' }}>Create Goal</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Goals;
