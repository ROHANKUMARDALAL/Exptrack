import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import styles from './LoginScreenStyles';
import TouchableButton from '../components/TouchableOpacity/TouchableOpacity';
import { saveAuthData,
  getAuthData, } from '../utils/authStorage';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const dispatch=useDispatch();
  const validateEmail = email => {
    const regex =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return regex.test(email);
  };

  useEffect(() => {
    const checkToken = async () => {
     const authData = await getAuthData();
if (authData?.token) {
  navigation.replace('ProjectScreen');
}
    };
    checkToken();
  }, [navigation]);

  const handleLogin = async() => {
    if (email.trim() === '') {
      Toast.show('Please enter email');
      return;
    }
    if (!validateEmail(email)) {
      Toast.show('Please enter a valid email');
      return;
    }
    if (password.trim() === '') {
      Toast.show('Please enter password');
      return;
    }
    if (password.length < 6) {
      Toast.show('Password must be at least 6 characters');
      return;
    }
     const payload = {
    email: email.trim(),
    password,
  };
     try {
    setLoading(true);
const auth=require('./Service')
    const response = await auth.login(payload);
    console.log('Login Response =>', response);
    if (response?.Error?.ErrorCode === 0 ) {
      const responseData=response?.Data;
      const authData = {
  token: responseData.token,
  user: responseData.user,
};
await saveAuthData(authData);
     dispatch(
  setUser({
    token: authData.token,
    user: authData.user,
  }),
);

      Toast.show(response?.message || 'Login Successful');

      navigation.replace('ProjectScreen');
    } else {
      Toast.show(response?.Error?.ErrorMessage || 'Login Failed');
    }
  } catch (error) {
    console.log('Login Error =>', error);
    Toast.show(error?.message || 'Something went wrong');
  } finally {
    setLoading(false);
  }
  };


  return (

  <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}>

    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollContainer}>

      <View style={styles.card}>

        <Text style={styles.emoji}>✈️</Text>

        <Text style={styles.heading}>
          Welcome Back
        </Text>

        <Text style={styles.subHeading}>
          Login to continue your journey
        </Text>

        <Text style={styles.label}>
          Email Address
        </Text>

        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          returnKeyType="next"
        />

        <Text style={styles.label}>
          Password
        </Text>

        <View style={styles.passwordView}>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#999"
            secureTextEntry={secureText}
            value={password}
            onChangeText={setPassword}
            style={styles.passwordInput}
            returnKeyType="done"
          />

          <TouchableOpacity
            onPress={() => setSecureText(!secureText)}>
            <Text style={styles.show}>
              {secureText ? 'Show' : 'Hide'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableButton
          text="Login"
          onPress={handleLogin}
          loading={loading}
          style={styles.loginButton}
        />

        <TouchableOpacity>
          <Text style={styles.forgot}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
<TouchableOpacity
  style={styles.registerContainer}
  onPress={() => navigation.navigate('RegisterScreen')}>
  <Text style={styles.registerText}>
    Don't have an account?
  </Text>

  <Text style={styles.registerNow}>
    Register Now
  </Text>
</TouchableOpacity>
      </View>

    </ScrollView>

  </KeyboardAvoidingView>

  );
};

export default LoginScreen;
