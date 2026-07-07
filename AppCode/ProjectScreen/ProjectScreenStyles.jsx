import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f7ff',
  },
  backgroundGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
     paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerCard: {  
    marginBottom: 16,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  orbOne: {
    width: 110,
    height: 110,
    top: -24,
    right: -20,
  },
  orbTwo: {
    width: 70,
    height: 70,
    bottom: -10,
    left: -8,
  },
 
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
  },
  backIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  appBarTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  appBarSpacer: {
    width: 40,
    height: 40,
  },
  summaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
   
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
   
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: 4,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  summaryHint: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 11,
    marginTop: 4,
  },
  summaryRight: {
    alignItems: 'flex-end',
  },
  summaryChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 8,
  },
  summaryChipText: {
    color: '#4f46e5',
    fontSize: 12,
    fontWeight: '700',
  },
  metricPill: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
  },
  metricPillText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 30,
    elevation: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  sectionSubtitle: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 2,
  },
  addButton: {
   borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 13,
    backgroundColor: '#19dd16',
   
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  cardWrapper: {
    marginBottom: 18,
  },
  animatedBorder: {
    borderWidth: 2,
    borderRadius: 12,
    overflow: 'visible',
    shadowColor: '#7c3aed',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  card: {
    borderRadius: 11,
  },
  cardAccent: {
   padding:4
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingLeft: 4,
    marginTop: 4,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  iconBubble: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconBubbleText: {
    fontSize: 10,
    fontWeight: '700',
  },
  projectName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flexShrink: 1,
  },
  statusBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
      borderRadius: 999,
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: '#4f46e5',
      shadowColor: '#4f46e5',
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.14,
      shadowRadius: 12,
      elevation: 6,
  },
  progressBadge: {
      color: '#ffffff',
  },
  completedBadge: {
    backgroundColor: '#d1fae5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: '#16a34a',
  },
  progressText: {
    color: '#d97706',
  },
  completedText: {
    color: '#059669',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingLeft: 8,
  },
  label: {
    color: '#6b7280',
    fontSize: 13,
  },
  value: {
    color: '#111827',
    fontWeight: '600',
  },
  valueExpense: {
    color: '#dc2626',
    fontWeight: '600',
  },
  valueSavings: {
    color: '#16a34a',
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 14,
    paddingLeft: 4,
    borderTopWidth: 1,
    borderTopColor: '#f2f5fb',
  },
  footerLabel: {
    color: '#6b7280',
    fontSize: 11,
  },
  footerValue: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  footerChip: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  footerChipText: {
    color: '#4f46e5',
    fontSize: 11,
    fontWeight: '700',
  },
});

export default styles;
