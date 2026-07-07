import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({

  container: {
  flex: 1,
  backgroundColor: '#F4F7FC',
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
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 6,
    },
  },

  emoji: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 15,
  },

  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },

  subHeading: {
    textAlign: 'center',
    color: '#777',
    marginTop: 8,
    marginBottom: 35,
    fontSize: 15,
  },

  label: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
    fontWeight: '600',
  },

  input: {
    backgroundColor: '#F7F8FA',
    borderRadius: 15,
    paddingHorizontal: 18,
    height: 56,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E4E7EC',
  },

  passwordView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E4E7EC',
    paddingHorizontal: 18,
  },

  passwordInput: {
    flex: 1,
    height: 56,
    fontSize: 16,
  },

  show: {
    color: '#3B82F6',
    fontWeight: '600',
  },

  loginButton: {
   
    marginTop: 35,
  },

  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  forgot: {
    textAlign: 'center',
    marginTop: 22,
    color: '#3B82F6',
    fontWeight: '600',
    fontSize: 15,
  },

});
export default styles;  