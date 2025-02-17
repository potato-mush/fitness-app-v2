import { db } from '../firebase/config';
import { doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';

export const updateUserProgress = async (userId, workoutData) => {
  try {
    console.log('Updating progress for user:', userId);
    
    if (!userId) {
      throw new Error('No user ID provided');
    }

    const userStatsRef = doc(db, 'userStats', userId);
    let userStatsDoc = await getDoc(userStatsRef);
    let currentStats = userStatsDoc.exists() ? userStatsDoc.data() : null;

    // Initialize stats if they don't exist
    if (!currentStats) {
      const initialStats = {
        level: 1,
        xp: 0,
        xpMax: 1000,
        stamina: 100,
        staminaMax: 100,
        chest: 0,
        arms: 0,
        abs: 0,
        legs: 0,
        back: 0,
        totalCalories: 0,
        totalExercises: 0,
        lastWorkout: null,
        streak: 0
      };
      await setDoc(userStatsRef, initialStats);
      currentStats = initialStats;
    }

    // Calculate XP gain based on workout type
    const xpGained = workoutData.exercises * 10; // 10 XP per exercise
    let newXP = (currentStats.xp || 0) + xpGained;
    let newLevel = currentStats.level || 1;
    let newXPMax = currentStats.xpMax || 1000;

    // Level up check
    while (newXP >= newXPMax) {
      newXP -= newXPMax;
      newLevel++;
      newXPMax = Math.floor(newXPMax * 1.5);
    }

    // Calculate muscle group specific updates
    const muscleUpdates = workoutData.muscleGroups.reduce((acc, muscle) => {
      acc[muscle] = increment(1);
      return acc;
    }, {});

    const updates = {
      level: newLevel,
      xp: newXP,
      xpMax: newXPMax,
      stamina: Math.max(0, (currentStats.stamina || 100) - 10), // Decrease stamina by 10
      totalCalories: increment(workoutData.calories),
      totalExercises: increment(workoutData.exercises),
      lastWorkout: new Date().toISOString(),
      streak: increment(1),
      ...muscleUpdates // Add muscle-specific updates
    };

    console.log('Applying updates:', updates);
    await updateDoc(userStatsRef, updates);

    // Verify the update
    const updatedDoc = await getDoc(userStatsRef);
    console.log('Updated document:', updatedDoc.data());

    return updatedDoc.data();
  } catch (error) {
    console.error('Error in updateUserProgress:', error);
    throw error;
  }
};

export const getUserStats = async (userId) => {
  try {
    const userStatsRef = doc(db, 'userStats', userId);
    const userStatsDoc = await getDoc(userStatsRef);
    
    if (!userStatsDoc.exists()) {
      return null;
    }
    
    return userStatsDoc.data();
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
};
