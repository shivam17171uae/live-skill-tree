import React from 'react';

function TaskWidget({ tasks, onTaskUpdate, onTaskAdd, onTaskDelete }) {
    const handleAddTask = (e) => { /* ... unchanged ... */ e.preventDefault(); const taskText = e.target.elements.newTask.value.trim(); if (taskText) { onTaskAdd(taskText); e.target.reset(); } };

    // === THE FIX: Add a check for the tasks object ===
    if (!tasks) {
        return <div id="task-widget" className="widget"><h3>Hero's Tasks</h3></div>;
    }

    const allTasks = Object.entries(tasks).flatMap(([category, data]) =>
        data.tasks.map((task, index) => ({ ...task, category, index }))
    );

    return (
        <div id="task-widget" className="widget">
            <h3>Hero's Tasks</h3>
            {allTasks.length === 0 ? (
                <p className="empty-state">No tasks today. Add one below!</p>
            ) : (
                <ul id="task-list">
                    {allTasks.map((task) => (
                        <li key={`${task.category}-${task.index}`} className={task.completed ? 'completed' : ''}>
                            <input type="checkbox" checked={task.completed} onChange={(e) => onTaskUpdate(task.category, task.index, e.target.checked)} />
                            <label>{task.text}</label>
                            {task.category === "Discipline & Chores" && <button className="delete-task-btn" onClick={() => onTaskDelete(task.category, task.index)}>&times;</button>}
                        </li>
                    ))}
                </ul>
            )}
            <form id="add-task-form" onSubmit={handleAddTask}>
                <input name="newTask" type="text" placeholder="Add a custom daily task..." autoComplete="off" />
                <button type="submit">+</button>
            </form>
        </div>
    );
}
export default TaskWidget;