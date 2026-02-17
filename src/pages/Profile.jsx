import React from 'react';
import Card from '../components/Card';
import { User, Download, Upload, Settings, Shield } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { usePlanner } from '../context/PlannerContext.jsx';
import { useTraining } from '../context/TrainingContext.jsx';
import { useNotes } from '../context/NotesContext.jsx';
import { useFinance } from '../context/FinanceContext.jsx';
import { useGoals } from '../context/GoalsContext.jsx';
import { useReflection } from '../context/ReflectionContext.jsx';
import { BADGES } from '../data/badges';

const Profile = () => {
    const { userData } = useUser();
    const { tasks } = usePlanner();
    const { routines, history } = useTraining();
    const { notes } = useNotes();
    const { transactions } = useFinance();
    const { goals } = useGoals();
    const { entries } = useReflection();

    const handleExport = () => {
        const data = {
            tasks,
            training: { routines, history },
            notes,
            finance: transactions,
            goals,
            reflection: entries,
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lifeos-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                alert("Import feature detected valid JSON. To implement full restore, we would need to overwrite current contexts.");
                console.log("Imported Data:", data);
            } catch (err) {
                alert("Invalid backup file.");
            }
        };
        reader.readAsText(file);
    };

    const displayName = userData?.username ? `@${userData.username}` : (userData?.phoneNumber ? `User ${userData.phoneNumber.slice(-4)}` : 'User');

    return (
        <div style={{ padding: '20px', paddingBottom: '100px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Profile</h1>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 8px 32px rgba(37, 99, 235, 0.3)' }}>
                    <User size={48} color="white" />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{displayName}</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Level {userData?.level || 1} Achiever</p>
                <div style={{ fontSize: '12px', color: 'var(--color-training)', marginTop: '4px' }}>{userData?.xp || 0} XP • {userData?.streak || 0} Day Streak</div>
            </div>

            {/* Badges Section */}
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Achievements</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px', marginBottom: '32px' }}>
                {BADGES.map((badge) => {
                    // Logic to check if badge is unlocked
                    // For now, we need to pass all data to the condition or check a user.badges array
                    // Let's assume user.badges contains IDs of unlocked badges for now
                    const isUnlocked = userData?.badges?.includes(badge.id);
                    const Icon = badge.icon;

                    return (
                        <div key={badge.id} style={{
                            background: isUnlocked ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                            border: isUnlocked ? `1px solid ${badge.color}` : '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            padding: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            opacity: isUnlocked ? 1 : 0.5,
                            filter: isUnlocked ? 'none' : 'grayscale(100%)'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: isUnlocked ? `${badge.color}20` : 'rgba(255,255,255,0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '8px',
                                color: badge.color
                            }}>
                                <Icon size={20} />
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>{badge.name}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{badge.description}</div>
                        </div>
                    );
                })}
            </div>

            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Data Management</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Card
                    onClick={handleExport}
                    style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
                >
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '12px' }}>
                        <Download size={24} color="#10B981" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>Export Details</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Backup all your local data</div>
                    </div>
                </Card>

                <Card style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
                    <div style={{ background: 'rgba(37, 99, 235, 0.1)', padding: '10px', borderRadius: '12px' }}>
                        <Upload size={24} color="#2563EB" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>Import Data</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Restore from backup file</div>
                    </div>
                    <input
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                    />
                </Card>
            </div>

            <h3 style={{ fontSize: '18px', margin: '24px 0 16px' }}>Settings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Card style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px' }}>
                        <Settings size={24} color="var(--text-secondary)" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold' }}>Preferences</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Theme, notifications</div>
                    </div>
                </Card>
                <Card style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px' }}>
                        <Shield size={24} color="var(--text-secondary)" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold' }}>Privacy</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Local storage encryption</div>
                    </div>
                </Card>
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                LifeOS v1.0.0
            </div>
        </div>
    );
};

export default Profile;
