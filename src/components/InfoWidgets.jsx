import React from 'react';

// This is the component that was crashing
function InfoWidgets({ playerState, achievements }) {
    // === THE FIX: Add a check to ensure data exists before rendering ===
    if (!playerState || !achievements) {
        return null; // Render nothing if the data isn't ready yet
    }

    return (
        <div className="stats-and-info-grid">
            <div className="widget mini-widget"><h3>LEVEL</h3><p>{playerState.level}</p></div>
            <div className="widget mini-widget"><h3>XP</h3><p>{`${playerState.xp} / ${playerState.xpToNextLevel}`}</p></div>
            <div className="widget mini-widget"><h3>STREAK</h3><p>🔥 {playerState.streak}</p></div>
            <div id="achievements-widget" className="widget mini-widget">
                <h3>ACHIEVEMENTS</h3>
                <ul id="achievements-list">
                    {Object.keys(achievements).map(key => (
                        <li key={key} title={achievements[key].name} className={playerState.unlockedAchievements.includes(key) ? 'unlocked' : ''}>
                            {achievements[key].icon}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
export default InfoWidgets;