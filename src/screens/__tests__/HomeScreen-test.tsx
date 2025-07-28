import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

describe('HomeScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('Z Messenger')).toBeDefined();
    expect(getByText('Conversations')).toBeDefined();
    expect(getByText('Add Friend')).toBeDefined();
    expect(getByText('Settings')).toBeDefined();
    expect(getByText('Profile')).toBeDefined();
  });
});
