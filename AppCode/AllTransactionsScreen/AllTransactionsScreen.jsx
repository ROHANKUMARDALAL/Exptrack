import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import styles from './AllTransactionsScreenStyles';
import CustomAppBar from '../components/CustomAppBar/CustomAppBar';
const AllTransactionsScreen = ({ navigation, route }) => {
  const transactions = route?.params?.transactions || [];

  return (
    <SafeAreaView style={styles.safeArea}>
        <CustomAppBar
        title={route?.params?.projectName || 'Project'}
        onLeftPress={() => navigation.goBack()}
        leftIcon="←"
      />
      <View style={styles.container}>
        <FlatList
          data={transactions}
          keyExtractor={(item, index) => `${item.title}-${index}`}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <View style={styles.leftSection}>
                <View style={[styles.icon, item.type === 'income' ? styles.incomeIcon : styles.expenseIcon]}>
                  <Text style={styles.iconText}>{item.type === 'income' ? '↑' : '↓'}</Text>
                </View>
                <View>
                  <Text style={styles.transactionTitle}>{item.title}</Text>
                  <Text style={styles.transactionSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Text style={[styles.amount, item.type === 'income' ? styles.incomeText : styles.expenseText]}>
                {item.amount}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default AllTransactionsScreen;


