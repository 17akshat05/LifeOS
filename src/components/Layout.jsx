import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, LineChart, User, Grip } from 'lucide-react';
import '../index.css';

import { useUser } from '../context/UserContext';
import { Navigate } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  const { user, userData, loading } = useUser();

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  // Protection: If not logged in & not on login page -> Go to Login
  if (!user && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in BUT has no username, FORCE them to /onboarding
  // unless they are already there.
  if (user && !userData?.username && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="layout-container" style={{ minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {/* Background blobs for aesthetic */}
      <div style={{
        position: 'fixed',
        top: '-20%',
        left: '-20%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(0,0,0,0) 70%)',
        zIndex: -1,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-10%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, rgba(0,0,0,0) 70%)',
        zIndex: -1,
        pointerEvents: 'none',
      }} />

      <main className="content animate-fade-in" style={{ flex: 1, paddingBottom: '100px' }}>
        <Outlet />
      </main>

      {/* Navigation - Responsive via CSS Media Queries */}
      <nav className="main-nav glass-card">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home size={24} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LineChart size={24} />
          <span>Analytics</span>
        </NavLink>
        <NavLink to="/leaderboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Grip size={24} />
          <span>Rank</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <User size={24} />
          <span>Profile</span>
        </NavLink>
      </nav>

      <style>{`
        .main-nav {
            position: fixed;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: space-around;
            
            /* Mobile Default (Bottom Bar) */
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 400px;
            height: 70px;
        }

        .nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 10px;
            gap: 4px;
            transition: all 0.3s ease;
            position: relative;
            padding: 8px;
            border-radius: 12px;
        }

        .nav-item.active {
            color: var(--text-primary);
            background: rgba(255,255,255,0.05);
        }
        
        .nav-item.active::after {
            content: '';
            position: absolute;
            bottom: 4px;
            width: 4px;
            height: 4px;
            background: var(--text-primary);
            border-radius: 50%;
            box-shadow: 0 0 8px var(--text-primary);
        }

        .nav-item:hover {
            color: #fff;
            background: rgba(255,255,255,0.05);
        }

        /* Desktop / Tablet Styles */
        @media (min-width: 768px) {
            .layout-container {
                flex-direction: row !important;
                padding-left: 100px; /* Space for side nav */
                padding-bottom: 0 !important;
            }

            .content {
                padding-bottom: 20px !important;
                max-width: 1200px;
                margin: 0 auto;
                width: 100%;
            }

            .main-nav {
                bottom: auto;
                top: 50%;
                left: 20px;
                transform: translateY(-50%);
                width: 80px;
                height: auto;
                max-width: none;
                flex-direction: column;
                padding: 20px 0;
                gap: 32px;
            }

            .nav-item {
                width: 60px;
                height: 60px;
            }

            .nav-item.active::after {
                bottom: auto;
                right: 4px;
                top: 50%;
                transform: translateY(-50%);
            }
        }
      `}</style>
    </div>
  );
};

export default Layout;
