import{StyleSheet, }from'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backText: {
    color: '#4f46e5',
    fontSize: 15,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  spacer: {
    width: 56,
  },
  list: {
    paddingBottom: 24,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  incomeIcon: {
    backgroundColor: '#dcfce7',
  },
  expenseIcon: {
    backgroundColor: '#fee2e2',
  },
  iconText: {
    fontSize: 16,
    fontWeight: '700',
  },
  transactionTitle: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 14,
  },
  transactionSubtitle: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 2,
  },
  amount: {
    fontWeight: '700',
    fontSize: 14,
  },
  incomeText: {
    color: '#16a34a',
  },
  expenseText: {
    color: '#dc2626',
  },
});
export default styles;
