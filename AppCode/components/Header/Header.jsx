import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const Header = ({ title, subtitle, onAddPress }) => {
  return (
    <View style={styles.headerCard}>
      <View style={styles.leftSection}>
        <Text style={styles.greeting}>Hello, Rohan</Text>
        <Text testID="dashboard-title" style={styles.title}>
          {title}
        </Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

    
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
     paddingHorizontal: 20,
  },
  leftSection: {
    flex: 1,
    marginRight: 12,
  },
  greeting: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
