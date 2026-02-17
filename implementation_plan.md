# Gamification & Multi-User Implementation Plan

## Goal
Implement a multi-user authentication system with advanced gamification mechanics (XP, Levels, Leaderboard) and daily login bonuses.

# Firebase & Gamification Implementation Plan

## Goal
Integrate Firebase for Phone Authentication and Firestore for real-time data sync. Implement advanced gamification (XP tiers, Leaderboard).

## Architecture
- **Backend**: Firebase (Auth + Firestore).
- **Auth**: Phone Number (`firebase/auth`).
- **Database**: Cloud Firestore.
- **Sync Strategy**:
  - Create a custom hook `useDataSync(key, initialValue)` that wraps `useLocalStorage`.
  - If logged in: Syncs with Firestore `users/{uid}/data/{key}`.
  - If logged out: Falls back to `localStorage`.

## Data Model (Firestore)
- **`users/{uid}`**:
  - `phoneNumber`: string
  - `xp`: number
  - `level`: number (computed or stored)
  - `streak`: number
  - `lastLogin`: timestamp
  - `displayName`: string (optional)
- **`users/{uid}/data/planner`**: `{ tasks: [...] }`
- **`users/{uid}/data/training`**: `{ routines: [...], history: [...] }`
- **`users/{uid}/data/notes`**: `{ notes: [...], folders: [...] }`
- ... (similar for finance, goals, reflection)

## Components & Contexts
- **`src/firebase.js`**: Firebase configuration and exports (`auth`, `db`).
- **`src/context/UserContext.jsx`**:
  - Manages Auth State (`user`, `loading`).
  - Manages Gamification (`addXP`, `streak` logic).
  - Listens to `users/{uid}` for real-time XP updates.
- **`src/pages/Login.jsx`**: Phone number input + OTP verification UI.
- **`src/hooks/useDataSync.js`**: The new storage abstraction.

## Gamification Logic
- **Leveling Formula**:
  - Lvl 1-50: 100 XP/lvl
  - Lvl 51-100: 300 XP/lvl
  - Lvl 101-150: 1000 XP/lvl
  - Lvl 151-300: 5000 XP/lvl
- **Rewards**:
  - Daily Login: 10 XP * (Streak Day % 7). Max 70 XP.
  - Sunday Random Bonus: 100-600 XP (if streak >= 6).

## Verification
- Test login/logout.
- Verify XP calculation crosses tier boundaries correctly.
- Verify daily streak increments and resets.
- Verify Sunday verification bonus.
