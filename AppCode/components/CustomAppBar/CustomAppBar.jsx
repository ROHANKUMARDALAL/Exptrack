import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import TouchableButton from '../TouchableOpacity/TouchableOpacity';

const CustomAppBar = ({
  title,
  subtitle,
  leftIcon = '←',
  onLeftPress,
  rightIcon,
  rightText,
  onRightPress,
  style,
  titleStyle,
  subtitleStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <TouchableButton
        onPress={onLeftPress}
        backgroundColor="#eef2ff"
        textColor="#4f46e5"
        borderRadius={14}
        height={44}
        style={styles.sideButton}
      >
        <Text style={styles.actionText}>{leftIcon}</Text>
      </TouchableButton>

      <View style={styles.titleWrap}>
        <Text style={[styles.title, titleStyle]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, subtitleStyle]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {onRightPress ? (
        <TouchableButton
          onPress={onRightPress}
          backgroundColor="#eef2ff"
          textColor="#4f46e5"
          borderRadius={14}
          height={44}
          style={styles.sideButton}
        >
          {rightIcon ? (
            <Text style={styles.actionText}>{rightIcon}</Text>
          ) : (
            <Text style={styles.rightText}>{rightText}</Text>
          )}
        </TouchableButton>
      ) : (
        <View style={styles.sidePlaceholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#e5e8ed',
    borderBottomWidth: 1,
    borderBottomColor: '#eef2ff',
  },
  titleWrap: {
    flex: 1,
    marginHorizontal: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 2,
  },
  sideButton: {
    minWidth: 44,
    paddingHorizontal: 12,
    elevation: 0,
    shadowOpacity: 0,
  },
  actionText: {
    color: '#4f46e5',
    fontSize: 16,
    fontWeight: '700',
  },
  rightText: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '700',
  },
  sidePlaceholder: {
    width: 44,
  },
});

export default CustomAppBar;
