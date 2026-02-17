import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Planner from './modules/planner/Planner';
import Training from './modules/training/Training';
import ActiveWorkout from './modules/training/ActiveWorkout';
import Notes from './modules/notes/Notes';
import Finance from './modules/finance/Finance';
import Goals from './modules/goals/Goals';
import Reflection from './modules/reflection/Reflection';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<Profile />} />
          <Route path="login" element={<Login />} />
          <Route path="leaderboard" element={<Leaderboard />} />

          <Route path="planner" element={<Planner />} />
          <Route path="training" element={<Training />} />
          <Route path="training/active" element={<ActiveWorkout />} />
          <Route path="notes" element={<Notes />} />
          <Route path="finance" element={<Finance />} />
          <Route path="goals" element={<Goals />} />
          <Route path="reflection" element={<Reflection />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
