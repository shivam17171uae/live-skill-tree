// src/data.js
export function getDefaultPlayerState() {
    return {
        level: 0, xp: 0, xpToNextLevel: 100, streak: 0, lastVisitDate: null,
        stats: { intellect: 1, health: 1, creativity: 1, discipline: 1 },
        unlockedAchievements: []
    };
}

export function getDefaultGameData() {
    return {
        tasks: {
            "Mind & Learning": { stat: "intellect", xp: 10, tasks: [{ text: "Read 10 pages", completed: false }] },
            "Health & Fitness": { stat: "health", xp: 15, tasks: [{ text: "15-minute workout", completed: false }] },
            "Creative Pursuits": { stat: "creativity", xp: 10, tasks: [{ text: "Practice a skill for 20 mins", completed: false }] },
            "Discipline & Chores": { stat: "discipline", xp: 5, tasks: [] }
        },
        achievements: {
            "health_novice": { name: "Health Novice", icon: "💪", condition: (stats) => stats.health >= 10 },
            "intellect_novice": { name: "Intellect Novice", icon: "🧠", condition: (stats) => stats.intellect >= 10 },
        }
    };
}