

import React from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import StackScreen from './AppCode/navigationScreen/StackScreen';
import { Provider } from 'react-redux';
import store from './AppCode/redux/Store'
enableScreens();

const App = () => {
  return (
    <Provider store={store}>

    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
    </Provider>
  );
};

export default App;