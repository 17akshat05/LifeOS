import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useUser } from '../context/UserContext';
import Card from '../components/Card';
import { Phone, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

const Login = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('phone'); // 'phone' or 'otp'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Redirect if already logged in
    if (user) {
        navigate('/');
        return null;
    }

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response) => {
                    // reCAPTCHA solved
                }
            });
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (phoneNumber.length < 10) {
            setError('Please enter a valid phone number.');
            setLoading(false);
            return;
        }

        try {
            setupRecaptcha();
            const appVerifier = window.recaptchaVerifier;
            // Ensure format is +[CountryCode][Number]
            // For now assuming default country code if missing, but better to force user to add it
            const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

            const confirmationResult = await signInWithPhoneNumber(auth, formattedNumber, appVerifier);
            window.confirmationResult = confirmationResult;
            setStep('otp');
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to send OTP. Check console.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await window.confirmationResult.confirm(otp);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <Card style={{ width: '100%', maxWidth: '400px', padding: '32px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Welcome to LifeOS</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Login to sync your progress</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', color: '#EF4444', padding: '12px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                {step === 'phone' ? (
                    <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Phone Number</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="tel"
                                    placeholder="+1 234 567 8900"
                                    value={phoneNumber}
                                    onChange={e => setPhoneNumber(e.target.value)}
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px 12px 12px 40px', borderRadius: '12px', color: 'white', fontSize: '16px' }}
                                />
                            </div>
                            <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '6px' }}>Includes country code (e.g., +1 for USA)</p>
                        </div>

                        <div id="recaptcha-container"></div>

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
                            {loading ? <Loader2 className="animate-spin" /> : <>Send Code <ArrowRight size={18} /></>}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Verification Code</label>
                            <div style={{ position: 'relative' }}>
                                <ShieldCheck size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="text"
                                    placeholder="123456"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value)}
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px 12px 12px 40px', borderRadius: '12px', color: 'white', fontSize: '16px', letterSpacing: '2px' }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                background: 'var(--color-finance)',
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
                            {loading ? <Loader2 className="animate-spin" /> : 'Verify & Login'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep('phone')}
                            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            Change phone number
                        </button>
                    </form>
                )}
            </Card>
        </div>
    );
};

export default Login;
