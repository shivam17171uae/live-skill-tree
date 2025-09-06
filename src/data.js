// src/data.js
export function getDefaultPlayerState() {
    return {
        level: 0,
        xp: 150, // Start with some XP to buy rewards
        xpToNextLevel: 100,
        streak: 0,
        lastVisitDate: null,
        stats: { intellect: 1, health: 1, creativity: 1, discipline: 1 },
        unlockedAchievements: []
    };
}

export function getDefaultGameData() {
    return {
        good_habits: {
            "Morning Sunlight": { icon: "☀️", xp: 30, completed: false, stat: "health" },
            "Cold Shower": { icon: "❄️", xp: 70, completed: false, stat: "discipline" },
            "Reading": { icon: "📚", xp: 30, completed: false, stat: "intellect" },
            "Workout": { icon: "🏋️", xp: 100, completed: false, stat: "health" },
            "Good Sleep": { icon: "😴", xp: 90, completed: false, stat: "health" },
            "Journaling": { icon: "✍️", xp: 20, completed: false, stat: "creativity" },
        },
        bad_habits: {
            "Watching YouTube": { icon: "📺", xp: -10, completed: false },
            "Smoking": { icon: "🚬", xp: -100, completed: false },
            "Bad Sleep": { icon: "🥱", xp: -90, completed: false },
            "Scrolling": { icon: "📱", xp: -50, completed: false },
        },
        rewards: {
            "2 Hour Netflix": { icon: "🎬", cost: 300 },
            "35min Video Game": { icon: "🎮", cost: 50 },
            "30min Social Media": { icon: "💬", cost: 40 },
            "Hang out with Friends": { icon: "👥", cost: 100 },
        },
        // Custom user-added tasks
        custom_tasks: {
            "Discipline & Chores": { stat: "discipline", xp: 5, tasks: [] }
        }
    };
}