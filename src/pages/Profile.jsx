import React from 'react';
import Card from '../components/Card';
import { User, Download, Upload, Settings, Shield } from 'lucide-react';
import { usePlanner } from '../context/PlannerContext.jsx';
import { useTraining } from '../context/TrainingContext.jsx';
import { useNotes } from '../context/NotesContext.jsx';
import { useFinance } from '../context/FinanceContext.jsx';
import { useGoals } from '../context/GoalsContext.jsx';
import { useReflection } from '../context/ReflectionContext.jsx';

const Profile = () => {
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
                // In a real app, we would validate and merge data here.
                // For this prototype, we'll just alert the user that this feature 
                // requires a complex merge strategy or clearing local storage first.
                alert("Import feature detected valid JSON. To implement full restore, we would need to overwrite current contexts.");
                console.log("Imported Data:", data);
            } catch (err) {
                alert("Invalid backup file.");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div style={{ padding: '20px', paddingBottom: '100px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Profile</h1>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 8px 32px rgba(37, 99, 235, 0.3)' }}>
                    <User size={48} color="white" />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Akshat</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Level 5 Achiever</p>
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
