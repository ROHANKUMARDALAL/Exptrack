/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import HomeScreen from '../AppCode/ProjectHomeScreen/HomeScreen';
import AllTransactionsScreen from '../AppCode/AllTransactionsScreen/AllTransactionsScreen';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});

test('renders the expense dashboard heading', () => {
  let component;

  ReactTestRenderer.act(() => {
    component = ReactTestRenderer.create(
      <HomeScreen navigation={{ goBack: jest.fn(), navigate: jest.fn() }} />,
    );
  });

  const title = component.root.findByProps({ testID: 'dashboard-title' });
  expect(title.props.children).toContain('Expense Dashboard');
});

test('calculates savings and saved percentage from transactions', () => {
  let component;

  ReactTestRenderer.act(() => {
    component = ReactTestRenderer.create(
      <HomeScreen navigation={{ goBack: jest.fn(), navigate: jest.fn() }} />,
    );
  });

  const textNodes = component.root.findAllByType('Text').map(node => node.props.children);
  expect(textNodes.join(' ')).toContain('₹3,877.30');
  expect(textNodes.join(' ')).toContain('93%');
});

test('renders the all transactions screen heading', () => {
  let component;

  ReactTestRenderer.act(() => {
    component = ReactTestRenderer.create(
      <AllTransactionsScreen
        navigation={{ goBack: jest.fn() }}
        route={{ params: { transactions: [] } }}
      />,
    );
  });

  const title = component.root.findByProps({ testID: 'all-transactions-title' });
  expect(title.props.children).toContain('All Transactions');
});
