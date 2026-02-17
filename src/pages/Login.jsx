import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useUser } from '../context/UserContext';
import Card from '../components/Card';
import { Phone, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

const Login = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    // Auth States
    const [method, setMethod] = useState('phone'); // 'phone' | 'email'
    const [emailStep, setEmailStep] = useState('login'); // 'login' | 'signup'

    // Inputs
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState(''); // For signup

    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('input'); // 'input' | 'otp'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Redirect if already logged in
    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    // Recaptcha for Phone
    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': () => { }
            });
        }
    };

    // --- Handlers ---

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await signInWithPopup(auth, googleProvider);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Google Login Failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (emailStep === 'signup') {
                const res = await createUserWithEmailAndPassword(auth, email, password);
                // Ideally update profile with name here
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            navigate('/');
        } catch (err) {
            console.error(err);
            setError(err.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
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
            const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
            const confirmationResult = await signInWithPhoneNumber(auth, formattedNumber, appVerifier);
            window.confirmationResult = confirmationResult;
            setStep('otp');
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to send OTP.');
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
            setError('Invalid OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <Card style={{ width: '100%', maxWidth: '400px', padding: '32px' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Welcome to LifeOS</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Login to sync your progress</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', color: '#EF4444', padding: '12px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                {/* Method Toggles */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px' }}>
                    <button
                        onClick={() => setMethod('phone')}
                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: method === 'phone' ? 'var(--color-planner)' : 'transparent', color: 'white', fontWeight: method === 'phone' ? 'bold' : 'normal', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        Phone
                    </button>
                    <button
                        onClick={() => setMethod('email')}
                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: method === 'email' ? 'var(--color-planner)' : 'transparent', color: 'white', fontWeight: method === 'email' ? 'bold' : 'normal', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        Email
                    </button>
                </div>

                {/* EMAIL FORM */}
                {method === 'email' && (
                    <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '12px', color: 'white', fontSize: '16px' }}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '12px', color: 'white', fontSize: '16px' }}
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            style={{ background: 'white', color: 'black', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (emailStep === 'login' ? 'Login' : 'Sign Up')}
                        </button>

                        <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {emailStep === 'login' ? "Don't have an account? " : "Already have an account? "}
                            <span
                                onClick={() => setEmailStep(emailStep === 'login' ? 'signup' : 'login')}
                                style={{ color: 'var(--color-planner)', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                {emailStep === 'login' ? 'Sign Up' : 'Login'}
                            </span>
                        </div>
                    </form>
                )}

                {/* PHONE FORM */}
                {method === 'phone' && (
                    step === 'input' ? (
                        <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                            <div id="recaptcha-container"></div>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{ background: 'white', color: 'black', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.7 : 1 }}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <>Send Code <ArrowRight size={18} /></>}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                            <button
                                type="submit"
                                disabled={loading}
                                style={{ background: 'var(--color-finance)', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Verify & Login'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep('input')}
                                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Change phone number
                            </button>
                        </form>
                    )
                )}

                {/* GOOGLE BUTTON (Already Visible) */}
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                        OR
                        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                    </div>
                    <button
                        onClick={handleGoogleLogin}
                        type="button"
                        style={{ background: 'white', color: 'black', padding: '12px', borderRadius: '12px', border: 'none', fontWeight: '600', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                    >
                        <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.225 -9.426 56.472 -10.685 57.325 L -10.685 60.125 L -6.791 60.125 C -4.512 58.018 -3.264 55.059 -3.264 51.509 Z" /><path fill="#34A853" d="M -14.754 63.239 C -11.516 63.239 -8.801 62.171 -6.821 60.351 L -10.685 57.551 C -11.721 58.211 -13.063 58.589 -14.754 58.589 C -17.894 58.589 -20.553 56.457 -21.502 53.609 L -25.476 53.609 L -25.476 56.691 C -23.554 60.503 -19.621 63.239 -14.754 63.239 Z" /><path fill="#FBBC05" d="M -21.502 53.609 C -21.732 52.92 -21.867 52.181 -21.867 51.42 C -21.867 50.659 -21.745 49.921 -21.502 49.232 L -21.502 46.15 L -25.464 46.15 C -26.273 47.765 -26.754 49.54 -26.754 51.42 C -26.754 53.3 -26.273 55.075 -25.464 56.691 L -21.502 53.609 Z" /><path fill="#EA4335" d="M -14.754 44.251 C -12.984 44.251 -11.425 44.859 -10.174 46.052 L -6.875 42.753 C -8.858 40.907 -11.573 39.601 -14.754 39.601 C -19.621 39.601 -23.554 42.337 -25.464 46.15 L -21.502 49.232 C -20.553 46.384 -17.894 44.251 -14.754 44.251 Z" /></g></svg>
                        Continue with Google
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default Login;
