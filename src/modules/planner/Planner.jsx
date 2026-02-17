import React, { useState } from 'react';
import { usePlanner } from '../../context/PlannerContext';
import Card from '../../components/Card';
import { Plus, Check, Trash2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { isToday, isFuture, parseISO, format } from 'date-fns';

const Planner = () => {
    const { tasks, addTask, toggleTask, deleteTask } = usePlanner();
    const [filter, setFilter] = useState('today'); // today, upcoming, all
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Modal State
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState('medium');
    const [newTaskDate, setNewTaskDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [newTaskTime, setNewTaskTime] = useState('12:00');

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        // Combine date and time
        const dateTime = new Date(`${newTaskDate}T${newTaskTime}`);
        addTask(newTaskTitle, newTaskDesc, newTaskPriority, dateTime);

        // Reset and close
        setNewTaskTitle('');
        setNewTaskDesc('');
        setIsModalOpen(false);
    };

    const filteredTasks = tasks.filter(task => {
        const taskDate = parseISO(task.date);
        if (filter === 'today') return isToday(taskDate);
        if (filter === 'upcoming') return isFuture(taskDate);
        return true;
    }).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date

    const getPriorityColor = (p) => {
        if (p === 'high') return '#EF4444';
        if (p === 'medium') return '#F59E0B';
        return '#10B981';
    };

    return (
        <div style={{ padding: '20px', paddingBottom: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Planner</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        background: 'var(--color-planner)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                    }}
                >
                    <Plus size={24} />
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                {['today', 'upcoming', 'all'].map(t => (
                    <button
                        key={t}
                        onClick={() => setFilter(t)}
                        style={{
                            background: filter === t ? 'rgba(255,255,255,0.1)' : 'transparent',
                            border: '1px solid var(--glass-border)',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            color: filter === t ? 'white' : 'var(--text-secondary)',
                            textTransform: 'capitalize',
                            fontSize: '14px',
                            cursor: 'pointer'
                        }}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Task List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredTasks.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
                        No tasks found.
                    </div>
                ) : (
                    filteredTasks.map(task => (
                        <Card key={task.id} style={{ display: 'flex', alignItems: 'center', padding: '16px', gap: '12px' }}>
                            <button
                                onClick={() => toggleTask(task.id)}
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '6px',
                                    border: `2px solid ${task.completed ? 'var(--color-planner)' : 'var(--text-secondary)'}`,
                                    background: task.completed ? 'var(--color-planner)' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    padding: 0
                                }}
                            >
                                {task.completed && <Check size={14} color="white" />}
                            </button>

                            <div style={{ flex: 1 }}>
                                <div style={{
                                    textDecoration: task.completed ? 'line-through' : 'none',
                                    color: task.completed ? 'var(--text-secondary)' : 'white',
                                    fontWeight: '500'
                                }}>
                                    {task.title}
                                </div>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Clock size={12} />
                                        {format(parseISO(task.date), 'h:mm a')}
                                    </div>
                                    <div style={{ color: getPriorityColor(task.priority), textTransform: 'capitalize' }}>
                                        {task.priority}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => deleteTask(task.id)}
                                style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', opacity: 0.6 }}
                            >
                                <Trash2 size={18} />
                            </button>
                        </Card>
                    ))
                )}
            </div>

            {/* Add Task Modal overlay */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'end',
                    justifyContent: 'center'
                }} onClick={() => setIsModalOpen(false)}>
                    <div
                        onClick={e => e.stopPropagation()}
                        className="glass-card"
                        style={{
                            width: '100%',
                            maxWidth: '500px',
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                            padding: '24px',
                            animation: 'slideUp 0.3s ease-out'
                        }}
                    >
                        <h2 style={{ marginBottom: '20px' }}>New Task</h2>
                        <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <input
                                type="text"
                                placeholder="Task Title"
                                value={newTaskTitle}
                                onChange={e => setNewTaskTitle(e.target.value)}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--glass-border)',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    color: 'white',
                                    fontSize: '16px'
                                }}
                                autoFocus
                            />
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <input
                                    type="date"
                                    value={newTaskDate}
                                    onChange={e => setNewTaskDate(e.target.value)}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--glass-border)',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        color: 'white',
                                        flex: 1
                                    }}
                                />
                                <input
                                    type="time"
                                    value={newTaskTime}
                                    onChange={e => setNewTaskTime(e.target.value)}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--glass-border)',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        color: 'white',
                                        flex: 1
                                    }}
                                />
                            </div>
                            <select
                                value={newTaskPriority}
                                onChange={e => setNewTaskPriority(e.target.value)}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--glass-border)',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    color: 'white'
                                }}
                            >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>
                            <button
                                type="submit"
                                style={{
                                    background: 'var(--color-planner)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '16px',
                                    borderRadius: '16px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    marginTop: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                Add Task
                            </button>
                        </form>
                        <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
            `}</style>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Planner;
