import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_DATA = 'AUTH_DATA';

/**
 * Save Auth Data
 * {
 *   token: "...",
 *   user: {...}
 * }
 */
export const saveAuthData = async authData => {
  try {
    await AsyncStorage.setItem(
      AUTH_DATA,
      JSON.stringify(authData),
    );
  } catch (error) {
    console.warn('Failed to save auth data:', error);
  }
};

/**
 * Get Auth Data
 */
export const getAuthData = async () => {
  try {
    const data = await AsyncStorage.getItem(AUTH_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn('Failed to get auth data:', error);
    return null;
  }
};

/**
 * Clear Auth Data
 */
export const clearAuthData = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_DATA);
  } catch (error) {
    console.warn('Failed to clear auth data:', error);
  }
};