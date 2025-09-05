// src/api.js
import { supabase } from './supabaseClient';

// This function now ONLY loads data. It does not create users.
export async function loadProgressFromDB(userId) {
    if (!userId) return null;

    const { data, error } = await supabase
        .from('profiles')
        .select('player_state, game_data')
        .eq('id', userId)
        .single();

    if (error) {
        // We expect an error if the profile doesn't exist yet, so we just log it.
        console.log("Could not load profile, it might be created on first login.", error.message);
        return null;
    }
    return data;
}

// This function creates the user's data row AFTER they have signed up.
export async function createProfileForNewUser(userId, defaultState, defaultData) {
    const { error } = await supabase
        .from('profiles')
        .insert([{ id: userId, player_state: defaultState, game_data: defaultData }]);

    if (error) {
        console.error("Error creating profile:", error.message);
    }
}

export async function saveProgressToDB(userId, playerState, gameData) {
    if (!userId) return;
    const { error } = await supabase
        .from('profiles')
        .update({ player_state: playerState, game_data: gameData })
        .eq('id', userId);
    if (error) console.error("Error saving data:", error.message);
}