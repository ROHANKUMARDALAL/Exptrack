import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const StackScreen = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="Login"
        component={require('../LoginScreen/LoginScreen').default}
      />
      <Stack.Screen
        name="Home"
        component={require('../ProjectHomeScreen/HomeScreen').default}
      />
      <Stack.Screen
        name="AllTransactions"
        component={require('../AllTransactionsScreen/AllTransactionsScreen').default}
      />
      <Stack.Screen
        name="ProjectScreen"
        component={require('../ProjectScreen/ProjectScreen').default}
      />
    </Stack.Navigator>
  );
};

export default StackScreen;