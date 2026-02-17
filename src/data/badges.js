import { Sunrise, Flame, Dumbbell, Wallet, BookOpen, Star } from 'lucide-react';

export const BADGES = [
    {
        id: 'early_bird',
        name: 'Early Bird',
        description: 'Completed a task before 8 AM',
        icon: Sunrise,
        color: '#F59E0B', // Amber
        condition: (user, tasks, history, transactions) => {
            // Check if any completed task was finished before 8am local time
            // This requires tasks to have a 'completedAt' timestamp which we might need to add if missing
            return tasks.some(t => {
                if (!t.completedAt) return false;
                const hour = new Date(t.completedAt).getHours();
                return hour < 8;
            });
        }
    },
    {
        id: 'streak_master_1',
        name: 'Momentum',
        description: 'Reach a 7-day streak',
        icon: Flame,
        color: '#EF4444', // Red
        condition: (user) => user?.streak >= 7
    },
    {
        id: 'gym_rat',
        name: 'Gym Rat',
        description: 'Complete 10 workouts',
        icon: Dumbbell,
        color: '#10B981', // Emerald
        condition: (user, tasks, history) => history.length >= 10
    },
    {
        id: 'saver',
        name: 'Penny Pincher',
        description: 'Log 5 expenses',
        icon: Wallet,
        color: '#3B82F6', // Blue
        condition: (user, tasks, history, transactions) => {
            return transactions.filter(t => t.type === 'expense').length >= 5;
        }
    },
    {
        id: 'scholar',
        name: 'Scholar',
        description: 'Reach Level 5',
        icon: BookOpen,
        color: '#8B5CF6', // Violet
        condition: (user) => user?.level >= 5
    },
    {
        id: 'completionist',
        name: 'Task Master',
        description: 'Complete 50 tasks',
        icon: Star,
        color: '#EC4899', // Pink
        condition: (user, tasks) => tasks.filter(t => t.completed).length >= 50
    }
];
