// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { supabase } from './supabaseClient';
import { loadProgressFromDB, saveProgressToDB, createProfileForNewUser } from './api';
import { getDefaultPlayerState, getDefaultGameData } from './data';
import Auth from './components/Auth';
import Header from './components/Header';
import ThreeCanvas from './components/ThreeCanvas';
import StatsWidget from './components/StatsWidget';
import TaskWidget from './components/TaskWidget';
import InfoWidgets from './components/InfoWidgets';

function App() {
  const [session, setSession] = useState(null);
  const [playerState, setPlayerState] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (session) {
        setLoading(true); // Set loading to true when we START fetching data
        const data = await loadProgressFromDB(session.user.id);
        if (!data || !data.player_state) {
          await createProfileForNewUser(session.user.id, getDefaultPlayerState(), getDefaultGameData());
          setPlayerState(getDefaultPlayerState());
          setGameData(getDefaultGameData());
        } else {
          setPlayerState(data.player_state);
          setGameData(data.game_data);
        }
        setLoading(false); // Set loading to false when we are DONE
      }
    };
    loadData();
  }, [session]);

  useEffect(() => {
    if (!loading && playerState && gameData && session) {
      const timer = setTimeout(() => saveProgressToDB(session.user.id, playerState, gameData), 1000);
      return () => clearTimeout(timer);
    }
  }, [playerState, gameData, loading, session]);

  // Handler functions remain the same
  const handleTaskUpdate = (category, index, isCompleted) => { const newPlayerState = { ...playerState, stats: { ...playerState.stats } }; const newGameData = JSON.parse(JSON.stringify(gameData)); const task = newGameData.tasks[category].tasks[index]; if (isCompleted === task.completed) return; task.completed = isCompleted; const xpChange = isCompleted ? newGameData.tasks[category].xp : -newGameData.tasks[category].xp; const statChange = isCompleted ? 1 : -1; newPlayerState.xp += xpChange; newPlayerState.stats[newGameData.tasks[category].stat] += statChange; setPlayerState(newPlayerState); setGameData(newGameData); };
  const handleTaskAdd = (taskText) => { const newGameData = JSON.parse(JSON.stringify(gameData)); newGameData.tasks["Discipline & Chores"].tasks.push({ text: taskText, completed: false }); setGameData(newGameData); };
  const handleTaskDelete = (category, index) => { const newGameData = JSON.parse(JSON.stringify(gameData)); newGameData.tasks[category].tasks.splice(index, 1); setGameData(newGameData); };

  // --- THE FINAL FIX: The Definitive Conditional Rendering Logic ---

  // If we don't know the auth state yet, show nothing or a primary loader
  if (loading && session === null) {
    return <div className="loading-overlay"><div className="spinner"></div></div>;
  }

  // If we know the auth state and there is no user, show the login page
  if (!session) {
    return <Auth />;
  }

  // If there IS a user session, but we are still loading their data, show the loader
  if (loading || !playerState || !gameData) {
    return <div className="loading-overlay"><div className="spinner"></div></div>;
  }

  // If we have a session AND the data is loaded, show the dashboard
  return (
    <div className="dashboard-grid">
      <div className="header-area widget"><Header /></div>
      <div className="grid-column col1-area"><div id="canvas-container" className="widget"><ThreeCanvas /></div></div>
      <div className="grid-column col2-area"><InfoWidgets playerState={playerState} achievements={gameData.achievements} /><StatsWidget stats={playerState.stats} /></div>
      <div className="grid-column col3-area"><TaskWidget tasks={gameData.tasks} onTaskUpdate={handleTaskUpdate} onTaskAdd={handleTaskAdd} onTaskDelete={handleTaskDelete} /></div>
    </div>
  );
}
export default App;