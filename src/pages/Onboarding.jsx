import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import Card from '../components/Card';
import { User, Check, Loader2, AlertCircle } from 'lucide-react';

const Onboarding = () => {
    const { user, userData } = useUser();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // If already has username, go Home
    React.useEffect(() => {
        if (userData?.username) {
            navigate('/');
        }
    }, [userData, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || username.length < 3) {
            setError('Username must be at least 3 characters.');
            return;
        }

        setLoading(true);

        try {
            // Check uniqueness
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('username', '==', username.trim()));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setError('Username already taken. Please choose another.');
                setLoading(false);
                return;
            }

            // Save username
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                username: username.trim(),
                isOnboarded: true
            });

            // Redirect home
            // Force reload to update context state or handle checks? 
            // Navigation should be enough if layout checks context
            navigate('/');
            window.location.reload(); // Ensure context refreshes with new data
        } catch (err) {
            console.error(err);
            setError('Failed to save username. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#0F0F14' }}>
            <Card style={{ width: '100%', maxWidth: '400px', padding: '32px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Setup Profile</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Choose a unique username for the leaderboard</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Username</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="text"
                                placeholder="crypto_king"
                                value={username}
                                onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                                style={{
                                    width: '100%',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: error ? '1px solid #EF4444' : '1px solid var(--glass-border)',
                                    padding: '12px 12px 12px 40px',
                                    borderRadius: '12px',
                                    color: 'white',
                                    fontSize: '16px'
                                }}
                            />
                        </div>
                        {error && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#EF4444', fontSize: '12px', marginTop: '8px' }}>
                                <AlertCircle size={12} /> {error}
                            </div>
                        )}
                        <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '6px' }}>Only letters, numbers, and underscores.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            background: 'var(--color-planner)',
                            color: 'white',
                            padding: '16px',
                            borderRadius: '16px',
                            border: 'none',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Continue <Check size={18} /></>}
                    </button>
                </form>
            </Card>
        </div>
    );
};

export default Onboarding;
