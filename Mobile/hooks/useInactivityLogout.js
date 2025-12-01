import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TIMEOUT_DURATION = 5 * 60 * 1000;
const STORAGE_KEY = '@appBackgroundedTime';

export const useInactivityLogout = (logoutFunction) => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    
    checkInactiveTime();

    return () => {
    
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = async (nextAppState) => {
    
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');
      await checkInactiveTime();
    } 
    
    else if (nextAppState.match(/inactive|background/)) {
      console.log('App has gone to the background.');
      await setBackgroundTimestamp();
    }
    
    appState.current = nextAppState;
  };

  const setBackgroundTimestamp = async () => {
    try {
      const now = new Date().getTime();
      await AsyncStorage.setItem(STORAGE_KEY, now.toString());
    } catch (e) {
      console.error('Error saving timestamp to AsyncStorage', e);
    }
  };

  const checkInactiveTime = async () => {
    try {
      const backgroundedTime = await AsyncStorage.getItem(STORAGE_KEY);
      
    
      if (backgroundedTime === null) {
        return; 
      }

      const lastActiveTime = parseInt(backgroundedTime, 10);
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - lastActiveTime;

      console.log(`Time difference: ${timeDifference / 1000}s`);

      if (timeDifference > TIMEOUT_DURATION) {
        console.log('App inactive for over 5 minutes. Logging out.');
    
        logoutFunction();
      }

    
      await AsyncStorage.removeItem(STORAGE_KEY);

    } catch (e) {
      console.error('Error checking inactive time', e);
    }
  };
};