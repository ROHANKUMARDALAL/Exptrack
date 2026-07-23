// import {StyleSheet} from 'react-native';

// const styles = StyleSheet.create({

//   container: {
//   flex: 1,
//   backgroundColor: '#F4F7FC',
// },

// scrollContainer: {
//   flexGrow: 1,
//   justifyContent: 'center',
//   paddingHorizontal: 25,
//   paddingVertical: 30,
// },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 25,
//     padding: 25,
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOpacity: 0.12,
//     shadowRadius: 10,
//     shadowOffset: {
//       width: 0,
//       height: 6,
//     },
//   },

//   emoji: {
//     fontSize: 60,
//     textAlign: 'center',
//     marginBottom: 15,
//   },

//   heading: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#222',
//     textAlign: 'center',
//   },

//   subHeading: {
//     textAlign: 'center',
//     color: '#777',
//     marginTop: 8,
//     marginBottom: 35,
//     fontSize: 15,
//   },

//   label: {
//     fontSize: 14,
//     color: '#444',
//     marginBottom: 8,
//     fontWeight: '600',
//   },

//   input: {
//     backgroundColor: '#F7F8FA',
//     borderRadius: 15,
//     paddingHorizontal: 18,
//     height: 56,
//     fontSize: 16,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#E4E7EC',
//   },

//   passwordView: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F7F8FA',
//     borderRadius: 15,
//     borderWidth: 1,
//     borderColor: '#E4E7EC',
//     paddingHorizontal: 18,
//   },

//   passwordInput: {
//     flex: 1,
//     height: 56,
//     fontSize: 16,
//   },

//   show: {
//     color: '#3B82F6',
//     fontWeight: '600',
//   },

//   loginButton: {
   
//     marginTop: 35,
//   },

//   loginText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '700',
//   },

//   forgot: {
//     textAlign: 'center',
//     marginTop: 22,
//     color: '#3B82F6',
//     fontWeight: '600',
//     fontSize: 15,
//   },

// });
// export default styles;  
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5E60CE',
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingVertical: 30,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 25,

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 10,
  },

  emoji: {
    fontSize: 65,
    textAlign: 'center',
    marginBottom: 10,
  },

  heading: {
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    color: '#222',
  },

  subHeading: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
    marginBottom: 35,
    fontSize: 15,
  },

  label: {
    color: '#444',
    marginBottom: 8,
    marginTop: 12,
    fontWeight: '700',
    fontSize: 15,
  },

  input: {
    height: 55,
    borderRadius: 14,
    backgroundColor: '#F4F6FA',
    paddingHorizontal: 18,
    fontSize: 16,
    color: '#222',
    borderWidth: 1,
    borderColor: '#E8EAF3',
  },

  passwordView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F6FA',
    borderRadius: 14,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#E8EAF3',
  },

  passwordInput: {
    flex: 1,
    height: 55,
    color: '#222',
    fontSize: 16,
  },

  show: {
    color: '#5E60CE',
    fontWeight: '700',
    fontSize: 15,
  },

  loginButton: {
    marginTop: 30,
    borderRadius: 15,
    height: 55,
    backgroundColor: '#5E60CE',
  },

  forgot: {
    marginTop: 18,
    alignSelf: 'flex-end',
    color: '#5E60CE',
    fontWeight: '700',
    fontSize: 15,
  },

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 35,
    alignItems: 'center',
  },

  registerText: {
    color: '#666',
    fontSize: 15,
  },

  registerNow: {
    marginLeft: 6,
    color: '#5E60CE',
    fontWeight: '800',
    fontSize: 16,
  },
});