import AsyncStorage from '@react-native-async-storage/async-storage';

export const LOGIN_TOKEN_KEY = 'LOGIN_TOKEN';

export const saveLoginToken = async token => {
  try {
    await AsyncStorage.setItem(LOGIN_TOKEN_KEY, token);
  } catch (error) {
    console.warn('Failed to save login token:', error);
  }
};

export const getLoginToken = async () => {
  try {
    return AsyncStorage.getItem(LOGIN_TOKEN_KEY);
  } catch (error) {
    console.warn('Failed to read login token:', error);
    return null;
  }
};

export const removeLoginToken = async () => {
  try {
    await AsyncStorage.removeItem(LOGIN_TOKEN_KEY);
  } catch (error) {
    console.warn('Failed to remove login token:', error);
  }
};
