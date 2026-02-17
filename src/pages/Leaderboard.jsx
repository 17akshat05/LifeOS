import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import Card from '../components/Card';
import { Trophy, Medal, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {
    const { user, userData, logout } = useUser();
    const navigate = useNavigate();
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('xp', 'desc'), limit(10));

        // Use onSnapshot for Real-Time Updates
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const results = [];
            querySnapshot.forEach((doc) => {
                results.push({ id: doc.id, ...doc.data() });
            });
            setLeaders(results);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching leaderboard:", error);
            setLoading(false);
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, []);

    const getRankIcon = (index) => {
        if (index === 0) return <Trophy size={24} color="#FFD700" fill="#FFD700" />;
        if (index === 1) return <Medal size={24} color="#C0C0C0" fill="#C0C0C0" />;
        if (index === 2) return <Medal size={24} color="#CD7F32" fill="#CD7F32" />;
        return <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>{index + 1}</span>;
    };

    return (
        <div style={{ padding: '20px', paddingBottom: '100px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Leaderboard</h1>
                <button
                    onClick={() => { logout(); navigate('/login'); }}
                    style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444', border: 'none', borderRadius: '12px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                    <LogOut size={16} /> <span style={{ fontSize: '12px' }}>Logout</span>
                </button>
            </div>

            {/* Current User Stats */}
            <Card style={{ padding: '20px', marginBottom: '32px', background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(168,85,247,0.2))', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--color-planner)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                            🤠
                        </div>
                        <div>
                            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>You</div>
                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Level {userData.level}</div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-training)' }}>{userData.xp} XP</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{userData.streak} Day Streak 🔥</div>
                    </div>
                </div>
            </Card>

            {/* Rankings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>Loading rankings...</div>
                ) : (
                    leaders.map((leader, index) => (
                        <Card key={leader.id} style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '40px', display: 'flex', justifyContent: 'center' }}>
                                {getRankIcon(index)}
                            </div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={20} color="white" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 'bold' }}>
                                    {leader.id === userData?.uid || leader.id === user?.uid
                                        ? `You (@${leader.username})`
                                        : (leader.username ? `@${leader.username}` : (leader.phoneNumber ? `User ${leader.phoneNumber.slice(-4)}` : 'Anonymous'))}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Level {leader.level}</div>
                            </div>
                            <div style={{ fontWeight: 'bold', color: 'var(--color-training)' }}>
                                {leader.xp} XP
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
