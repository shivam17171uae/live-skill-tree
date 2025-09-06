// src/components/Header.jsx
import React from 'react';
import { supabase } from '../supabaseClient';

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    height: '60px',
    backgroundColor: '#1e1e1e',
    borderBottom: '1px solid #333',
    color: '#e0e0e0',
    flexShrink: 0
};
const titleStyle = { fontSize: '1.5em', fontWeight: 'bold' };
const buttonStyle = {
    padding: '8px 16px', borderRadius: '6px', border: 'none',
    background: '#333', color: 'white', cursor: 'pointer', fontWeight: 'bold'
};

function Header() {
    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };
    return (
        <header style={headerStyle}>
            <div style={titleStyle}>Live Skill Tree</div>
            <button style={buttonStyle} onClick={handleSignOut}>Sign Out</button>
        </header>
    );
}
export default Header;