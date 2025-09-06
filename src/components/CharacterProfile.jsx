// src/components/CharacterProfile.jsx
import React from 'react';
import ThreeCanvas from './ThreeCanvas';

function CharacterProfile({ playerState, todayExps, dailyProgress }) {
    if (!playerState) return null;

    return (
        <div id="character-profile-widget" className="widget">
            {/* Added an icon directly in the h3 tag */}
            <h3>👤 Character Profile</h3>
            <div id="canvas-container">
                <ThreeCanvas />
            </div>
            <div className="profile-stats">
                <p>Total Exps: <strong>{playerState.xp}</strong></p>
                <p>Today Exps: <strong>{todayExps}</strong></p>

                <p>Daily Progress: <strong>{dailyProgress}%</strong></p>

                <div className="progress-bar-container">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${dailyProgress}%` }}
                    ></div>
                </div>

                <p style={{ color: '#2dd283', marginTop: '15px' }}>Keep Going!</p>
            </div>
        </div>
    );
}

export default CharacterProfile;