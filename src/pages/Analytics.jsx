import React from 'react';
import { useTraining } from '../context/TrainingContext.jsx';
import { usePlanner } from '../context/PlannerContext.jsx';
import { useFinance } from '../context/FinanceContext.jsx';
import Card from '../components/Card';
import { Trophy, TrendingUp, CheckCircle, Activity } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip, BarChart, Bar } from 'recharts';
import { format, subDays } from 'date-fns';

const Analytics = () => {
    const { history, getXP, getLevel } = useTraining();
    const { tasks } = usePlanner();
    const { transactions } = useFinance();

    // Calculate Completion Rate
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Real Productivity Data (Last 7 days - based on Workouts)
    const productivityData = Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(new Date(), 6 - i);
        const dayStr = format(date, 'EEE');
        const dateStr = date.toDateString();

        // Count completed workouts for this day
        const score = history.filter(h => new Date(h.date).toDateString() === dateStr).length;

        return {
            day: dayStr,
            score: score // Real count: 0 if no workouts
        };
    });

    return (
        <div style={{ padding: '20px', paddingBottom: '100px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Analytics</h1>

            {/* Level Card */}
            <Card style={{ padding: '24px', marginBottom: '16px', background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(0,0,0,0))', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.1)' }} />
                    <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '4px solid var(--color-goals)', borderTopColor: 'transparent', transform: 'rotate(45deg)' }} />
                    <Trophy size={32} color="gold" />
                </div>
                <div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Current Level</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{getLevel()}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-goals)' }}>{getXP()} Total XP</div>
                </div>
            </Card>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <Card style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-planner)' }}>
                        <CheckCircle size={16} />
                        <span style={{ fontSize: '12px' }}>Completion</span>
                    </div>
                    <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{completionRate}%</span>
                </Card>
                <Card style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-training)' }}>
                        <Activity size={16} />
                        <span style={{ fontSize: '12px' }}>Workouts</span>
                    </div>
                    <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{history.length}</span>
                </Card>
            </div>

            {/* Productivity Graph */}
            <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Weekly Productivity</h2>
            <Card style={{ height: '220px', padding: '16px', marginBottom: '24px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={productivityData}>
                        <XAxis dataKey="day" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
                            contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                        />
                        <Line type="monotone" dataKey="score" stroke="var(--color-planner)" strokeWidth={3} dot={{ fill: 'var(--color-planner)' }} />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export default Analytics;
