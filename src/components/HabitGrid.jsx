// src/components/HabitGrid.jsx
import React from 'react';
import AddItemForm from './AddItemForm'; // This line causes the error if the file doesn't exist

function HabitGrid({ title, habits, onHabitClick, type, playerXp, className, icon, justClickedHabit, onAddItem }) {

    const widgetClasses = `widget ${className || ''}`;
    const hasHabits = habits && Object.keys(habits).length > 0;

    return (
        <div className={widgetClasses}>
            <h3>
                {icon && <span className="widget-icon">{icon}</span>}
                {title}
            </h3>

            {hasHabits ? (
                <div className="habit-grid">
                    {Object.entries(habits).map(([name, data]) => {
                        const isReward = type === 'rewards';
                        const canAfford = isReward ? playerXp >= data.cost : true;
                        let cardClass = `habit-card ${type}-habit ${data.completed ? 'completed' : ''} ${isReward && !canAfford ? 'cannot-afford' : ''}`;

                        if (justClickedHabit && justClickedHabit.name === name && justClickedHabit.type === type) {
                            if (data.completed) {
                                cardClass += type === 'good_habits' ? ' flash-success' : ' flash-danger';
                            }
                        }

                        return (
                            <div key={name} className={cardClass} onClick={() => { if (!(isReward && !canAfford)) { onHabitClick(name, type); } }}>
                                <div className="habit-icon">{data.icon}</div>
                                <h4>{name}</h4>
                                <p>{isReward ? `Cost: ${data.cost} XP` : `XP: ${data.xp}`}</p>
                            </div>
                        );
                    })}
                </div>
            ) : (
                // Use a div to help with flexbox layout
                <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ color: 'var(--text-secondary-color)' }}>No {title.toLowerCase()} added yet.</p>
                </div>
            )}

            <AddItemForm type={type} onAddItem={onAddItem} />
        </div>
    );
}

export default HabitGrid;