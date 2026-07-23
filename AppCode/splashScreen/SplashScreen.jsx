import React,{useEffect,useRef} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuthData } from '../utils/authStorage';
const SplashScreen = ({navigation}) => {
    const scale = useRef(
        new Animated.Value(0.5)
    ).current;
    useEffect(()=>{
        Animated.spring(scale,{
            toValue:1,
            friction:5,
            useNativeDriver:true
        }).start();
        checkLogin();
    },[]);
 const checkLogin = async () => {
  try {
    const authData = await getAuthData();
    setTimeout(() => {
      if (authData?.token) {
        navigation.replace('Home');
      } else {
        navigation.replace('Login');
      }
    }, 5500);

  } catch (e) {
    navigation.replace('Login');
  }
};
    return(
        <LinearGradient
            colors={[
                '#667eea',
                '#764ba2',
                '#ff758c'
            ]}
            style={styles.container}
        >
            <Animated.View
                style={{
                    transform:[
                        {
                            scale:scale
                        }
                    ]
                }}
            >
                <LottieView
                    source={
                        require('../assets/splash.json')
                    }
                    autoPlay
                    loop
                    style={{
                        width:220,
                        height:220
                    }}
                />
    </Animated.View>
            <Text style={styles.title}>
                Exptrack
            </Text>
            <Text style={styles.sub}>
                Manage your expenses smartly
            </Text>
        </LinearGradient>
    )
}
export default SplashScreen;
const styles = StyleSheet.create({
container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
},
title:{
    marginTop:20,
    fontSize:38,
    fontWeight:'800',
    color:'#fff',
    letterSpacing:1
},
sub:{
    marginTop:10,
    color:'#fff',
    fontSize:16,
    opacity:.9
}
});