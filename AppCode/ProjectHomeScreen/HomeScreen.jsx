import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Modal,
  Animated,
  PanResponder,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import styles from './HomeScreenStyles';
import TouchableButton from '../components/TouchableOpacity/TouchableOpacity';
import CustomAppBar from '../components/CustomAppBar/CustomAppBar';

const transactions = [
  {
    title: 'Salary Deposit',
    subtitle: 'Today • 09:30',
    amount: 3500,
    type: 'income',
  },
  {
    title: 'Groceries',
    subtitle: 'Today • 13:10',
    amount: 84.5,
    type: 'expense',
  },
  {
    title: 'Freelance Project',
    subtitle: 'Yesterday • 19:00',
    amount: 650,
    type: 'income',
  },
  {
    title: 'Dinner Out',
    subtitle: 'Yesterday • 21:15',
    amount: 56.2,
    type: 'expense',
  },
  {
    title: 'Utility Bill',
    subtitle: 'Mon • 08:00',
    amount: 132,
    type: 'expense',
  },
];

const formatAmount = value =>
  `₹${value.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}`;

const HomeScreen = ({ navigation, route }) => {
  const [transactionsState, setTransactionsState] = useState(transactions);

  const income = transactionsState
    .filter(item => item.type === 'income')
    .reduce((total, item) => total + item.amount, 0);

  const expenses = transactionsState
    .filter(item => item.type === 'expense')
    .reduce((total, item) => total + item.amount, 0);

  const savings = income - expenses;
  const savedPercentage = income > 0 ? Math.round((savings / income) * 100) : 0;

  // prefer project data from route params when available
  const projectFromRoute = route && route.params && route.params.project;
  const displayIncome =
    projectFromRoute && typeof projectFromRoute.income === 'number'
      ? projectFromRoute.income
      : income;
  const displayExpenses =
    projectFromRoute && typeof projectFromRoute.expense === 'number'
      ? projectFromRoute.expense
      : expenses;
  const displaySavings =
    projectFromRoute && typeof projectFromRoute.savings === 'number'
      ? projectFromRoute.savings
      : savings;
  const displaySavedPercentage =
    displayIncome > 0
      ? Math.round((displaySavings / displayIncome) * 100)
      : savedPercentage;

  const summaryCards = [
    { label: 'Income', value: formatAmount(displayIncome), color: '#2ecc71' },
    {
      label: 'Expenses',
      value: formatAmount(displayExpenses),
      color: '#e74c3c',
    },
    { label: 'Savings', value: formatAmount(displaySavings), color: '#4f46e5' },
    { label: 'Budget', value: `${displaySavedPercentage}%`, color: '#f59e0b' },
  ];

  const formattedTransactions = transactionsState.map(item => ({
    ...item,
    amount: `${item.type === 'income' ? '+' : '-'} ${formatAmount(
      item.amount,
    )}`,
  }));
  // Bottom sheet modal state and animation
  const [sheetVisible, setSheetVisible] = useState(false);
  const screenHeight = Dimensions.get('window').height;
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const pan = useRef(new Animated.Value(0)).current;
  const topAnim = useRef(new Animated.Value(-160)).current;

  const openSheet = () => {
    // reset fields when opening
    setTypeText('');
    setEntryKind('Expense');
    setAmountInput('');
    setDescription('');
    setSheetVisible(true);
    pan.setValue(0);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    // start top shimmer
    topAnim.setValue(-160);
    Animated.loop(
      Animated.timing(topAnim, {
        toValue: 260,
        duration: 1400,
        useNativeDriver: true,
      }),
    ).start();
  };

  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: screenHeight,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setSheetVisible(false);
      // reset fields after closing
      setTypeText('');
      setEntryKind('Expense');
      setAmountInput('');
      setDescription('');
      pan.setValue(0);
      // stop top shimmer
      topAnim.stopAnimation();
      topAnim.setValue(-160);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          pan.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 120) {
          closeSheet();
        } else {
          Animated.spring(pan, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    }),
  ).current;

  // modal form state (transaction entry)
  const [typeText, setTypeText] = useState('');
  const [entryKind, setEntryKind] = useState('Expense'); // 'Income' or 'Expense'
  const [amountInput, setAmountInput] = useState('');
  const [description, setDescription] = useState('');

  const submitNewGroup = () => {
    const rawAmount = Number(amountInput) || 0;
    const newItem = {
      title: typeText || (entryKind === 'Income' ? 'Income' : 'Expense'),
      subtitle: new Date().toLocaleString(),
      amount: rawAmount,
      type: entryKind === 'Income' ? 'income' : 'expense',
      description,
    };
    // prepend so newest shows first
    setTransactionsState(prev => [newItem, ...prev]);
    console.log('New entry persisted:', newItem);
    closeSheet();
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomAppBar
        title={route.params?.project?.name || 'Project'}
        onLeftPress={() => navigation.goBack()}
        leftIcon="←"
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.balanceCard}>
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>
              {formatAmount(displaySavings)}
            </Text>
            <Text style={styles.balanceTrend}>↑ 12% from last month</Text>
          </View>

          <View style={styles.progressRing}>
            <Text style={styles.progressPercent}>
              {displaySavedPercentage}%
            </Text>
            <Text style={styles.progressLabel}>Saved</Text>
          </View>
        </View>

        <View style={styles.cardsGrid}>
          {summaryCards.map(card => (
            <View key={card.label} style={styles.summaryCard}>
              <View style={[styles.dot, { backgroundColor: card.color }]} />
              <Text style={styles.cardLabel}>{card.label}</Text>
              <Text style={styles.cardValue}>{card.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableButton
            text="See all"
            onPress={() =>
              navigation.navigate('AllTransactions', {
                projectName: route.params?.project?.name || 'Project',
                transactions: formattedTransactions,
              })
            }
            backgroundColor="transparent"
            textColor="#4f46e5"
            borderRadius={0}
            height={36}
            style={styles.sectionLinkButton}
          />
        </View>

        {formattedTransactions.map(item => (
          <View key={item.title} style={styles.transactionItem}>
            <View style={styles.transactionLeft}>
              <View
                style={[
                  styles.transactionIcon,
                  item.type === 'income'
                    ? styles.incomeIcon
                    : styles.expenseIcon,
                ]}
              >
                <Text style={styles.transactionIconText}>
                  {item.type === 'income' ? '↑' : '↓'}
                </Text>
              </View>
              <View>
                <Text style={styles.transactionTitle}>{item.title}</Text>
                <Text style={styles.transactionSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                item.type === 'income' ? styles.incomeText : styles.expenseText,
              ]}
            >
              {item.amount}
            </Text>
          </View>
        ))}
      </ScrollView>

      <TouchableButton
        text="+"
        onPress={openSheet}
        backgroundColor="#4f46e5"
        textColor="#fff"
        borderRadius={30}
        height={60}
        fontSize={30}
        style={styles.fab}
      />

      <Modal
        visible={sheetVisible}
        transparent
        animationType="none"
        statusBarTranslucent
      >
        <TouchableWithoutFeedback onPress={closeSheet}>
          <View style={styles.sheetOverlay} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetWrapper}
        >
          <Animated.View
            {...panResponder.panHandlers}
            style={[styles.sheetContainer, {transform: [{ translateY: Animated.add(translateY, pan) }]}]}
          >
            
            <View style={styles.sheetTopShimmer} pointerEvents="none">
              <Animated.View
                style={[
                  styles.sheetTopShimmerBar,
                  { transform: [{ translateX: topAnim }] },
                ]}
              />
            </View>
            <View style={styles.sheetHandle} />
            <TextInput
              placeholder="Type"
              placeholderTextColor="#000"
              value={typeText}
              onChangeText={setTypeText}
              style={styles.input}
            />

        <View style={styles.segmentedContainer}>
  {['Income', 'Expense'].map(opt => (
    <TouchableButton
      key={opt}
      onPress={() => setEntryKind(opt)}
      text={opt}
      backgroundColor={
        entryKind === opt
          ? opt === 'Income'
            ? '#16a34a' // Green for Income
            : '#4f46e5' // Blue for Expense
          : 'transparent'
      }
      textColor={entryKind === opt ? '#fff' : '#111827'}
      borderRadius={0}
      height={36}
      style={[
        styles.segmentButton,
       
      ]}
    />
  ))}
</View>

            <TextInput
              placeholder="Amount"
              placeholderTextColor="#000"
              value={amountInput}
              onChangeText={setAmountInput}
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              placeholder="Description"
              placeholderTextColor="#000"
              value={description}
              onChangeText={setDescription}
              style={[styles.input,{height: 100, textAlignVertical: 'center'}]}
              multiline={true}
              numberOfLines={4}
            />

            <TouchableButton
              text="Add"
              onPress={submitNewGroup}
              backgroundColor="#4f46e5"
              textColor="#fff"
              borderRadius={8}
              height={44}
              style={styles.modalAddButton}
            />
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreen;
