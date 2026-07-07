import Toast from 'react-native-simple-toast';

const AppToast = {

  success(message) {
    Toast.show(message, Toast.SHORT);
  },

  error(message) {
    Toast.show(message, Toast.SHORT);
  },

  info(message) {
    Toast.show(message, Toast.SHORT);
  },

  long(message) {
    Toast.show(message, Toast.LONG);
  },

};

export default AppToast;