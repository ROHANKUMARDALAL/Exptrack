import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const TouchableButton = ({
  text = '',
  onPress,
  loading = false,
  backgroundColor = '#3B82F6',
  textColor = '#fff',
  borderRadius = 16,
  height = 56,
  fontSize = 18,
  disabled = false,
  style,
  children,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor,
          borderRadius,
          height,
          opacity: disabled || loading ? 0.7 : 1,
        },
        style,
      ]}>

      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : children ? (
        children
      ) : (
        <Text
          style={{
            color: textColor,
            fontSize,
            fontWeight: '700',
          }}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default TouchableButton;

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});