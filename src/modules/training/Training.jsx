import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTraining } from '../../context/TrainingContext';
import Card from '../../components/Card';
import { Play, Plus, Trophy, Activity, Edit2, Trash2, X, Save } from 'lucide-react';
import HistoryGraph from './HistoryGraph';

const Training = () => {
    const { routines, history, getLevel, getXP, addRoutine, updateRoutine, deleteRoutine } = useTraining();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoutine, setEditingRoutine] = useState(null); // null = creating new

    // Form State
    const [routineName, setRoutineName] = useState('');
    const [exercises, setExercises] = useState([{ id: Date.now(), name: '', sets: 3, reps: '10' }]);

    const openModal = (routine = null) => {
        if (routine) {
            setEditingRoutine(routine);
            setRoutineName(routine.name);
            setExercises(routine.exercises);
        } else {
            setEditingRoutine(null);
            setRoutineName('');
            setExercises([{ id: Date.now(), name: '', sets: 3, reps: '10' }]);
        }
        setIsModalOpen(true);
    };

    const handleAddExercise = () => {
        setExercises([...exercises, { id: Date.now(), name: '', sets: 3, reps: '10' }]);
    };

    const handleRemoveExercise = (index) => {
        const newExercises = [...exercises];
        newExercises.splice(index, 1);
        setExercises(newExercises);
    };

    const handleExerciseChange = (index, field, value) => {
        const newExercises = [...exercises];
        newExercises[index][field] = value;
        setExercises(newExercises);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!routineName.trim() || exercises.length === 0) return;

        // Filter out empty exercises
        const validExercises = exercises.filter(ex => ex.name.trim() !== '');
        if (validExercises.length === 0) return;

        if (editingRoutine) {
            updateRoutine(editingRoutine.id, { name: routineName, exercises: validExercises });
        } else {
            addRoutine(routineName, validExercises);
        }
        setIsModalOpen(false);
    };

    return (
        <div style={{ padding: '20px', paddingBottom: '100px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Training</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '20px' }}>
                    <Trophy size={16} color="gold" />
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Lvl {getLevel()}</span>
                </div>
            </div>

            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <Card className="flex-center" style={{ flexDirection: 'column', padding: '16px', gap: '8px' }}>
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-training)' }}>{history.length}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Workouts</span>
                </Card>
                <Card className="flex-center" style={{ flexDirection: 'column', padding: '16px', gap: '8px' }}>
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-goals)' }}>{getXP()}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total XP</span>
                </Card>
            </div>

            {/* Progress Graph */}
            <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Progress</h2>
            <Card style={{ marginBottom: '24px', height: '200px', padding: '16px' }}>
                <HistoryGraph data={history} />
            </Card>

            {/* Routines */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px' }}>Routines</h2>
                <button
                    onClick={() => openModal()}
                    style={{ background: 'var(--color-training)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
                >
                    <Plus size={20} />
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {routines.map(routine => (
                    <Card key={routine.id} style={{ padding: '20px', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>{routine.name}</h3>
                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{routine.exercises.length} Exercises</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => openModal(routine)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => deleteRoutine(routine.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div style={{ marginBottom: '16px', maxHeight: '100px', overflowY: 'auto' }}>
                            {routine.exercises.slice(0, 3).map((ex, i) => (
                                <div key={i} style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                    • {ex.name} ({ex.sets}x{ex.reps})
                                </div>
                            ))}
                            {routine.exercises.length > 3 && <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>+ {routine.exercises.length - 3} more</div>}
                        </div>

                        <button
                            onClick={() => navigate(`/training/active`, { state: { routine } })}
                            style={{
                                width: '100%',
                                background: 'var(--color-training)',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                color: 'white',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
                            }}
                        >
                            <Play size={16} fill="white" /> Start Workout
                        </button>
                    </Card>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }} onClick={() => setIsModalOpen(false)}>
                    <div
                        onClick={e => e.stopPropagation()}
                        className="glass-card"
                        style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{editingRoutine ? 'Edit Routine' : 'New Routine'}</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}><X size={24} /></button>
                        </div>

                        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Routine Name</label>
                            <input
                                type="text"
                                value={routineName}
                                onChange={e => setRoutineName(e.target.value)}
                                placeholder="e.g., Leg Day"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '12px', color: 'white', marginBottom: '20px' }}
                            />

                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Exercises</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {exercises.map((ex, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <input
                                            type="text" placeholder="Exercise" value={ex.name} onChange={e => handleExerciseChange(index, 'name', e.target.value)}
                                            style={{ flex: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '8px', borderRadius: '8px', color: 'white', fontSize: '14px' }}
                                        />
                                        <input
                                            type="number" placeholder="Sets" value={ex.sets} onChange={e => handleExerciseChange(index, 'sets', e.target.value)}
                                            style={{ width: '50px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '8px', borderRadius: '8px', color: 'white', fontSize: '14px' }}
                                        />
                                        <input
                                            type="text" placeholder="Reps" value={ex.reps} onChange={e => handleExerciseChange(index, 'reps', e.target.value)}
                                            style={{ width: '60px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '8px', borderRadius: '8px', color: 'white', fontSize: '14px' }}
                                        />
                                        <button onClick={() => handleRemoveExercise(index)} style={{ background: 'none', border: 'none', color: '#EF4444' }}><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleAddExercise} style={{ marginTop: '12px', background: 'none', border: '1px dashed var(--text-secondary)', color: 'var(--text-secondary)', width: '100%', padding: '8px', borderRadius: '8px', fontSize: '12px' }}>
                                + Add Exercise
                            </button>
                        </div>

                        <div style={{ padding: '20px', borderTop: '1px solid var(--glass-border)' }}>
                            <button onClick={handleSave} style={{ width: '100%', background: 'var(--color-training)', color: 'white', padding: '12px', borderRadius: '12px', border: 'none', fontWeight: 'bold' }}>
                                Save Routine
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Training;
