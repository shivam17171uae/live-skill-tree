// src/components/Auth.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { createProfileForNewUser } from '../api';
import { getDefaultPlayerState, getDefaultGameData } from '../data'; // <-- IMPORTED

const authFormStyle = { display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px', margin: '100px auto', padding: '20px', backgroundColor: '#1e1e1e', borderRadius: '12px', border: '1px solid #333' };
const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #333', background: '#333', color: '#e0e0e0' };
const buttonStyle = { padding: '10px', borderRadius: '6px', border: 'none', background: '#0084ff', color: 'white', fontWeight: 'bold', cursor: 'pointer' };

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
        } catch (error) {
            alert(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async () => {
        try {
            setLoading(true);
            const { data: { user }, error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            if (user) {
                // Now correctly calls the imported functions
                await createProfileForNewUser(user.id, getDefaultPlayerState(), getDefaultGameData());
            }
            alert('Signup successful! Please check your email to confirm, then log in.');
        } catch (error) {
            alert(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={authFormStyle}>
            <h2 style={{ textAlign: 'center' }}>Skill Tree Login</h2>
            <p style={{ textAlign: 'center', color: '#a0a0a0' }}>Sign in or create an account</p>
            <form onSubmit={handleLogin}>
                <input style={inputStyle} type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input style={inputStyle} type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" style={buttonStyle} disabled={loading}>{loading ? 'Loading...' : 'Log In'}</button>
                <button type="button" style={{ ...buttonStyle, background: '#333' }} onClick={handleSignup} disabled={loading}>{loading ? '...' : 'Sign Up'}</button>
            </form>
        </div>
    );
}