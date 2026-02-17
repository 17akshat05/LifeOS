import React, { useState } from 'react';
import { useReflection } from '../../context/ReflectionContext';
import Card from '../../components/Card';
import { Plus, Smile, BookOpen, Heart, Calendar, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const Reflection = () => {
    const { entries, addEntry, getMoodEmoji } = useReflection();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [mood, setMood] = useState('neutral');
    const [gratitude, setGratitude] = useState('');
    const [journal, setJournal] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        addEntry(mood, gratitude, journal);
        setGratitude('');
        setJournal('');
        setMood('neutral');
        setIsModalOpen(false);
    };

    const moods = [
        { id: 'happy', emoji: '😊', label: 'Happy', color: '#10B981' },
        { id: 'excited', emoji: '🤩', label: 'Excited', color: '#F59E0B' },
        { id: 'neutral', emoji: '😐', label: 'Neutral', color: '#6B7280' },
        { id: 'sad', emoji: '😔', label: 'Sad', color: '#3B82F6' },
        { id: 'stressed', emoji: '😫', label: 'Stressed', color: '#EF4444' }
    ];

    return (
        <div style={{ padding: '20px', paddingBottom: '100px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', background: 'linear-gradient(to right, #F472B6, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Reflection</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Capture your journey</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        background: 'var(--color-reflection)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(244, 114, 182, 0.4)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <Plus size={24} color="white" />
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {entries.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        <BookOpen size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                        <p>No entries yet. Start by adding your first reflection.</p>
                    </div>
                ) : (
                    entries.map(entry => (
                        <div key={entry.id} style={{ display: 'flex', gap: '16px' }}>
                            {/* Timeline Line */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '8px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-reflection)', boxShadow: '0 0 8px var(--color-reflection)' }}></div>
                                <div style={{ width: '2px', flex: 1, background: 'rgba(255,255,255,0.1)', marginTop: '4px' }}></div>
                            </div>

                            <Card style={{ flex: 1, padding: '24px', animation: 'fadeIn 0.5s ease-out' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ fontSize: '32px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>{getMoodEmoji(entry.mood)}</div>
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{format(parseISO(entry.date), 'MMMM d, yyyy')}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{format(parseISO(entry.date), 'h:mm a')}</div>
                                        </div>
                                    </div>
                                </div>

                                {entry.gratitude && (
                                    <div style={{ marginBottom: '16px', background: 'rgba(244, 114, 182, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(244, 114, 182, 0.2)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-reflection)', marginBottom: '4px', fontWeight: 'bold' }}>
                                            <Heart size={14} fill="var(--color-reflection)" /> Gratitude
                                        </div>
                                        <p style={{ fontSize: '14px', fontStyle: 'italic', color: 'rgba(255,255,255,0.9)' }}>"{entry.gratitude}"</p>
                                    </div>
                                )}

                                {entry.journal && (
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 'bold' }}>
                                            <BookOpen size={14} /> Journal
                                        </div>
                                        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#E4E4E7', whiteSpace: 'pre-wrap' }}>{entry.journal}</p>
                                    </div>
                                )}
                            </Card>
                        </div>
                    ))
                )}
            </div>

            {/* Add Reflection Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }} onClick={() => setIsModalOpen(false)}>
                    <div
                        onClick={e => e.stopPropagation()}
                        className="glass-card"
                        style={{ width: '100%', maxWidth: '500px', padding: '0', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>New Reflection</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        <div style={{ padding: '24px', overflowY: 'auto' }}>
                            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div>
                                    <label style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'block', marginBottom: '12px', fontWeight: '500' }}>How are you feeling?</label>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                                        {moods.map(m => (
                                            <button
                                                key={m.id}
                                                type="button"
                                                onClick={() => setMood(m.id)}
                                                style={{
                                                    background: mood === m.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                                                    border: `1px solid ${mood === m.id ? m.color : 'var(--glass-border)'}`,
                                                    borderRadius: '16px',
                                                    padding: '12px 8px',
                                                    flex: 1,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    transform: mood === m.id ? 'scale(1.05)' : 'scale(1)'
                                                }}
                                            >
                                                <div style={{ fontSize: '28px', marginBottom: '4px' }}>{m.emoji}</div>
                                                <div style={{ fontSize: '10px', color: mood === m.id ? 'white' : 'var(--text-secondary)' }}>{m.label}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: '500' }}>What are you grateful for?</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., A warm cup of coffee..."
                                        value={gratitude}
                                        onChange={e => setGratitude(e.target.value)}
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '16px', color: 'white', fontSize: '16px' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: '500' }}>Journal Entry</label>
                                    <textarea
                                        placeholder="Write your thoughts..."
                                        value={journal}
                                        onChange={e => setJournal(e.target.value)}
                                        style={{ width: '100%', minHeight: '150px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '16px', color: 'white', resize: 'vertical', fontSize: '16px', lineHeight: '1.6' }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    style={{
                                        background: 'var(--color-reflection)',
                                        color: 'white',
                                        padding: '16px',
                                        borderRadius: '16px',
                                        border: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '16px',
                                        cursor: 'pointer',
                                        marginTop: '8px',
                                        boxShadow: '0 4px 12px rgba(244, 114, 182, 0.3)'
                                    }}
                                >
                                    Save Reflection
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reflection;
