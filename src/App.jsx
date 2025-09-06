// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { supabase } from './supabaseClient';
import { loadProgressFromDB, saveProgressToDB, createProfileForNewUser } from './api';
import { getDefaultPlayerState, getDefaultGameData } from './data';
import Auth from './components/Auth';
import Header from './components/Header';
import CharacterProfile from './components/CharacterProfile';
import HabitGrid from './components/HabitGrid';

function App() {
  const [session, setSession] = useState(null);
  const [playerState, setPlayerState] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [justClickedHabit, setJustClickedHabit] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) { setPlayerState(null); setGameData(null); }
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (session && !playerState) {
        setLoading(true);
        const data = await loadProgressFromDB(session.user.id);
        if (!data || !data.player_state || !data.game_data) {
          const defaultPlayer = getDefaultPlayerState();
          const defaultGame = getDefaultGameData();
          await createProfileForNewUser(session.user.id, defaultPlayer, defaultGame);
          setPlayerState(defaultPlayer);
          setGameData(defaultGame);
        } else {
          setPlayerState(data.player_state);
          setGameData(data.game_data);
        }
        setLoading(false);
      }
    };
    loadData();
  }, [session, playerState]);

  useEffect(() => {
    if (!loading && playerState && gameData && session) {
      const timer = setTimeout(() => saveProgressToDB(session.user.id, playerState, gameData), 1000);
      return () => clearTimeout(timer);
    }
  }, [playerState, gameData, loading, session]);

  const handleHabitClick = useCallback((name, type) => {
    const newPlayerState = { ...playerState, stats: { ...playerState.stats } };
    const newGameData = JSON.parse(JSON.stringify(gameData));
    const dataSet = newGameData[type];
    if (!dataSet || !dataSet[name]) return;
    if (type === 'good_habits' || type === 'bad_habits') {
      const habit = dataSet[name];
      habit.completed = !habit.completed;
      const xpChange = habit.completed ? habit.xp : -habit.xp;
      newPlayerState.xp += xpChange;
      if (habit.stat) {
        const statChange = habit.completed ? 1 : -1;
        newPlayerState.stats[habit.stat] += statChange;
      }
      setJustClickedHabit({ name, type });
      setTimeout(() => setJustClickedHabit(null), 400);
    } else if (type === 'rewards') {
      const reward = dataSet[name];
      if (newPlayerState.xp >= reward.cost) {
        newPlayerState.xp -= reward.cost;
        alert(`You redeemed the reward: ${name}!`);
      } else {
        alert("Not enough XP!");
      }
    }
    setPlayerState(newPlayerState);
    setGameData(newGameData);
  }, [playerState, gameData]);

  const handleAddItem = useCallback((name, newItem, type) => {
    if (gameData[type] && gameData[type][name]) {
      alert(`An item named "${name}" already exists.`);
      return;
    }
    setGameData(prevGameData => {
      const newGameData = JSON.parse(JSON.stringify(prevGameData));
      if (!newGameData[type]) {
        newGameData[type] = {};
      }
      newGameData[type][name] = newItem;
      return newGameData;
    });
  }, [gameData]);

  if (loading) { return <div className="loading-overlay"><div className="spinner"></div></div>; }
  if (!session) { return <Auth />; }
  if (!playerState || !gameData) { return <div className="loading-overlay"><div className="spinner"></div></div>; }

  const totalPossibleXP = Object.values(gameData.good_habits || {}).reduce((sum, habit) => sum + habit.xp, 0);
  const todayExps = Object.values(gameData.good_habits || {}).reduce((sum, habit) => (habit.completed ? sum + habit.xp : sum), 0);
  const dailyProgress = totalPossibleXP > 0 ? Math.round((todayExps / totalPossibleXP) * 100) : 0;

  return (
    <div className="app-container">
      <Header />
      <div className="dashboard-grid">
        <div className="grid-column">
          <CharacterProfile playerState={playerState} todayExps={todayExps} dailyProgress={dailyProgress} />
        </div>
        <div className="grid-column" id="habits-container">
          <HabitGrid title="Daily Habits" icon="✅" habits={gameData.good_habits} onHabitClick={handleHabitClick} type="good_habits" justClickedHabit={justClickedHabit} onAddItem={handleAddItem} />
          <HabitGrid title="Bad Habits" icon="❌" habits={gameData.bad_habits} onHabitClick={handleHabitClick} type="bad_habits" justClickedHabit={justClickedHabit} onAddItem={handleAddItem} />
          <HabitGrid
            title="Rewards"
            icon="🏆"
            habits={gameData.rewards}
            onHabitClick={handleHabitClick}
            type="rewards"
            playerXp={playerState.xp}
            className="grid-span-2"
            onAddItem={handleAddItem}
          />
        </div>
      </div>
    </div>
  );
}
export default App;