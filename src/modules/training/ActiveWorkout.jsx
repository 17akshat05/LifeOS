import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTraining } from '../../context/TrainingContext';
import Card from '../../components/Card';
import { Timer, CheckCircle, ChevronLeft } from 'lucide-react';

const ActiveWorkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logWorkout } = useTraining();
    const routine = location.state?.routine;

    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [completedExercises, setCompletedExercises] = useState([]);

    useEffect(() => {
        if (!routine) {
            navigate('/training');
            return;
        }

        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds(seconds => seconds + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds, routine, navigate]);

    const formatTime = (totalSeconds) => {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const toggleExercise = (exId) => {
        if (completedExercises.includes(exId)) {
            setCompletedExercises(prev => prev.filter(id => id !== exId));
        } else {
            setCompletedExercises(prev => [...prev, exId]);
        }
    };

    const handleFinish = () => {
        logWorkout(routine.id, seconds, completedExercises);
        setIsActive(false);
        navigate('/training'); // Could go to a summary screen
    };

    if (!routine) return null;

    return (
        <div style={{ padding: '20px', paddingBottom: '100px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <button
                    onClick={() => navigate('/training')}
                    style={{ background: 'none', border: 'none', color: 'white', marginRight: '16px' }}
                >
                    <ChevronLeft size={24} />
                </button>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>{routine.name}</h1>
                    <span style={{ fontSize: '14px', color: 'var(--color-training)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Timer size={14} /> {formatTime(seconds)}
                    </span>
                </div>
                <button
                    onClick={handleFinish}
                    style={{
                        background: 'var(--color-training)',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '14px'
                    }}
                >
                    Finish
                </button>
            </div>

            {/* Exercise List */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {routine.exercises.map(ex => {
                    const isDone = completedExercises.includes(ex.id);
                    return (
                        <Card
                            key={ex.id}
                            onClick={() => toggleExercise(ex.id)}
                            style={{
                                padding: '20px',
                                border: isDone ? '1px solid var(--color-training)' : '1px solid var(--glass-border)',
                                background: isDone ? 'rgba(249, 115, 22, 0.1)' : 'var(--glass-bg)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px', color: isDone ? 'white' : 'var(--text-primary)' }}>{ex.name}</h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>{ex.sets} sets × {ex.reps}</p>
                                </div>
                                {isDone && <CheckCircle size={24} color="var(--color-training)" />}
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default ActiveWorkout;
