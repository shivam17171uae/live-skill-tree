// src/components/AddItemForm.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../icons'; // Import our new icon list

function AddItemForm({ type, onAddItem }) {
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('');
    const [value, setValue] = useState('');
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const pickerRef = useRef(null); // Ref for the picker container

    // This effect handles closing the picker when clicking outside of it
    useEffect(() => {
        function handleClickOutside(event) {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsPickerOpen(false);
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [pickerRef]);


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !icon || !value || isNaN(parseInt(value))) {
            alert('Please fill out all fields, including selecting an icon.');
            return;
        }

        const numericValue = parseInt(value, 10);
        let newItem;

        if (type === 'rewards') {
            newItem = { icon, cost: numericValue };
        } else {
            const xpValue = type === 'bad_habits' ? -Math.abs(numericValue) : Math.abs(numericValue);
            newItem = { icon, xp: xpValue, completed: false };
        }

        onAddItem(name, newItem, type);
        setName('');
        setIcon('');
        setValue('');
    };

    const handleIconSelect = (selectedIcon) => {
        setIcon(selectedIcon);
        setIsPickerOpen(false);
    };

    const isReward = type === 'rewards';
    const valueLabel = isReward ? 'Cost' : 'XP';

    return (
        <form onSubmit={handleSubmit} className="add-item-form">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name (e.g., Read)"
                required
            />

            {/* --- ICON PICKER REPLACEMENT --- */}
            <div className="icon-picker-container" ref={pickerRef}>
                <button
                    type="button"
                    className="icon-picker-button"
                    onClick={() => setIsPickerOpen(!isPickerOpen)}
                >
                    {icon || 'Icon'}
                </button>
                {isPickerOpen && (
                    <div className="icon-picker-popover">
                        <div className="icon-picker-grid">
                            {ICONS.map(ico => (
                                <span
                                    key={ico}
                                    className="icon-picker-item"
                                    onClick={() => handleIconSelect(ico)}
                                >
                                    {ico}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {/* --- END REPLACEMENT --- */}

            <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={valueLabel}
                required
            />
            <button type="submit">+</button>
        </form>
    );
}

export default AddItemForm;