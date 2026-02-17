import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ListTodo, Dumbbell, FileText, Wallet, Target, Sparkles, CheckCircle2, Circle } from 'lucide-react';
import { format } from 'date-fns';
import { usePlanner } from '../context/PlannerContext.jsx';
import Card from '../components/Card';
import CircularProgress from '../components/CircularProgress';

const Home = () => {
    const navigate = useNavigate();
    const today = new Date();
    const hour = today.getHours();

    let greetingTime = "Morning";
    if (hour >= 12 && hour < 17) greetingTime = "Afternoon";
    if (hour >= 17) greetingTime = "Evening";

    const { tasks } = usePlanner();

    // Derived Data
    const incompleteTasks = tasks.filter(t => !t.completed).sort((a, b) => new Date(a.date) - new Date(b.date));
    const completedCount = tasks.filter(t => t.completed).length;
    const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

    const getPriorityColor = (p) => {
        if (p === 'high') return '#EF4444';
        if (p === 'medium') return '#F59E0B';
        return '#10B981';
    };
    const greeting = `Good ${greetingTime}, Akshat 👋`;

    const categories = [
        { id: 'planner', name: 'Planner', icon: <ListTodo size={28} />, color: 'var(--color-planner)', path: '/planner' },
        { id: 'training', name: 'Training', icon: <Dumbbell size={28} />, color: 'var(--color-training)', path: '/training' },
        { id: 'notes', name: 'Notes', icon: <FileText size={28} />, color: 'var(--color-notes)', path: '/notes' },
        { id: 'finance', name: 'Finance', icon: <Wallet size={28} />, color: 'var(--color-finance)', path: '/finance' },
        { id: 'goals', name: 'Goals', icon: <Target size={28} />, color: 'var(--color-goals)', path: '/goals' },
        { id: 'reflection', name: 'Reflection', icon: <Sparkles size={28} />, color: 'var(--color-reflection)', path: '/reflection' },
    ];

    return (
        <div style={{ padding: '24px 20px', paddingBottom: '100px' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>{greeting}</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    {format(today, 'EEEE, MMMM do')}
                </p>
            </div>

            {/* Progress Section */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
                <Card className="flex-center" style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.03)', padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <CircularProgress value={progress} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                                <span>Unfinished Tasks: </span><span style={{ color: 'white', fontWeight: 'bold' }}>{incompleteTasks.length}</span>
                            </div>
                            {incompleteTasks.length > 0 && (
                                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                                    <span>Next: </span><span style={{ color: 'var(--color-training)' }}>{incompleteTasks[0].title}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Incomplete Tasks Widget */}
            {incompleteTasks.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ListTodo size={20} color="var(--color-planner)" />
                        Pending Tasks
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {incompleteTasks.slice(0, 3).map(task => (
                            <Card key={task.id} onClick={() => navigate('/planner')} style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderLeft: `4px solid ${getPriorityColor(task.priority)}` }}>
                                <Circle size={20} color="var(--text-secondary)" />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '500' }}>{task.title}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                        {format(new Date(task.date), 'h:mm a')} • <span style={{ textTransform: 'capitalize' }}>{task.priority}</span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                        {incompleteTasks.length > 3 && (
                            <div onClick={() => navigate('/planner')} style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', marginTop: '4px' }}>
                                + {incompleteTasks.length - 3} more tasks
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Grid Menu */}
            <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Dashboard</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
            }}>
                {categories.map((cat) => (
                    <Card
                        key={cat.id}
                        onClick={() => navigate(cat.path)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            padding: '24px',
                            border: `1px solid ${cat.color}30` // tinted border
                        }}
                    >
                        <div style={{
                            color: cat.color,
                            background: `${cat.color}15`,
                            padding: '12px',
                            borderRadius: '50%',
                            boxShadow: `0 0 15px ${cat.color}20`
                        }}>
                            {cat.icon}
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{cat.name}</span>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Home;
