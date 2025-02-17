import { auth } from '../firebase/config';
import { signInAnonymously, onAuthStateChanged } from '@firebase/auth';

export const initializeAuth = async () => {
  try {
    // First check if we already have a user
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe(); // Stop listening immediately
        
        if (!user) {
          try {
            // No user, sign in anonymously
            const result = await signInAnonymously(auth);
            console.log('Anonymous auth successful', result.user.uid);
            resolve(result.user);
          } catch (error) {
            console.error('Anonymous auth failed:', error);
            reject(error);
          }
        } else {
          console.log('User already signed in:', user.uid);
          resolve(user);
        }
      });
    });
  } catch (error) {
    console.error('Error in initializeAuth:', error);
    throw error;
  }
};
