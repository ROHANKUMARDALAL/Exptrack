import React, {useEffect, useRef} from 'react';
import {Animated, Easing, View, Text, SafeAreaView, TouchableOpacity, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import styles from './ProjectScreenStyles';
import TouchableButton from '../components/TouchableOpacity/TouchableOpacity';
import { removeLoginToken } from '../utils/authStorage';

const projects = [
  {name: 'Website Redesign', income: 25000, expense: 8500, savings: 16500, status: 'Active', accent: '#4f46e5'},
  {name: 'Mobile App Launch', income: 18000, expense: 7200, savings: 10800, status: 'In Progress', accent: '#f59e0b'},
  {name: 'E-commerce Store', income: 32000, expense: 12500, savings: 19500, status: 'Active', accent: '#10b981'},
];

const formatAmount = value => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
const totalSavings = projects.reduce((sum, item) => sum + item.savings, 0);

const ProjectScreen = () => {
  const navigation = useNavigation();
  const borderAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(-240)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: 2500,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ).start();

    Animated.loop(
      Animated.parallel([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, []);

  const animatedBorderColors = borderAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['#7c3aed', '#22d3ee', '#f43f5e', '#f59e0b', '#7c3aed'],
  });

  const heroY = floatAnim.interpolate({inputRange: [0, 1], outputRange: [0, -12]});
  const heroOpacity = floatAnim.interpolate({inputRange: [0, 0.5, 1], outputRange: [0.28, 0.7, 0.28]});
  const shimmerTranslate = shimmerAnim.interpolate({inputRange: [0, 1], outputRange: [-220, 260]});

  const getStatusStyle = status => {
    if (status == 'Active') {
      return styles.activeBadge;
    }
    if (status == 'In Progress') {
      return styles.progressBadge;
    }
    return styles.completedBadge;
  };

  const getStatusTextStyle = status => {
    if (status == 'Active') {
      return styles.activeText;
    }
    if (status == 'In Progress') {
      return styles.progressText;
    }
    return styles.completedText;
  };

  const handleLogout = async () => {
    await removeLoginToken();
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#f5f7ff', '#eef2ff']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.backgroundGradient}>
        <LinearGradient colors={['#4f46e5', '#7c3aed']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.headerCard}>
            <Animated.View style={[styles.orb, styles.orbOne, {transform: [{translateY: heroY}], opacity: heroOpacity}]} />
            <Animated.View style={[styles.orb, styles.orbTwo, {transform: [{translateY: heroY}], opacity: heroOpacity}]} />
           
            <View style={styles.summaryBox}>
              <View style={styles.summaryContent}>
                <Text style={styles.summaryLabel}>Total Savings</Text>
                <Text style={styles.summaryValue}>{formatAmount(totalSavings)}</Text>
                </View>

              <View style={styles.summaryRight}>
                <View style={styles.summaryChip}>
                  <Text style={styles.summaryChipText}>+12.4%</Text>
                </View>
                <View style={styles.metricPill}>
                  <Text style={styles.metricPillText}>3 Projects</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          <View style={styles.sectionHeader}>
            <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
              <Text style={styles.addButtonText}>Add Group</Text>
            </TouchableOpacity>
          </View>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {projects.map(project => (
                <TouchableOpacity
                key={project.name}
                style={styles.cardWrapper}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('Home', {project})}>
                <Animated.View style={[styles.animatedBorder, {borderColor: animatedBorderColors}]}> 
                  <LinearGradient colors={['#ffffff', '#f8faff']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.card}>
                    <View style={[styles.cardAccent, {backgroundColor: project.accent}]} />
                    <View style={styles.cardTop}>
                      <View style={styles.titleWrap}>
                        <View style={[styles.iconBubble, {backgroundColor: `${project.accent}20`}]}>
                          <Text style={[styles.iconBubbleText, {color: project.accent}]}>●</Text>
                        </View>
                        <Text style={styles.projectName}>{project.name}</Text>
                      </View>
                    
                    </View>
<View style={{marginHorizontal: 5}}>

                    <View style={styles.row}>
                      <Text style={styles.label}>Income</Text>
                      <Text style={styles.value}>{formatAmount(project.income)}</Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.label}>Expense</Text>
                      <Text style={styles.valueExpense}>{formatAmount(project.expense)}</Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.label}>Savings</Text>
                      <Text style={styles.valueSavings}>{formatAmount(project.savings)}</Text>
                    </View>
</View>
                   
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>
            ))}
            <View style={styles.logoutContainer}>
              <TouchableButton
                text="Logout"
                onPress={handleLogout}
                backgroundColor="#ef4444"
                textColor="#fff"
                borderRadius={18}
                height={52}
                style={styles.logoutButton}
              />
            </View>
          </ScrollView>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ProjectScreen;
