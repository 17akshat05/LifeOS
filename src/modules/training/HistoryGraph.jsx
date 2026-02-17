import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { format, parseISO } from 'date-fns';

const HistoryGraph = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
                No workout data yet
            </div>
        );
    }

    // Process data for chart - group by date or just show last 7
    // Simplified: Show last 7 workouts duration
    const chartData = data.slice(0, 7).reverse().map(log => ({
        date: format(parseISO(log.date), 'M/d'),
        duration: log.duration / 60 // minutes
    }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
                <XAxis
                    dataKey="date"
                    stroke="var(--text-secondary)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                />
                <Bar dataKey="duration" fill="var(--color-training)" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default HistoryGraph;
