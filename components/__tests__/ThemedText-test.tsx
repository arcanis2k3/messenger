import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedText } from '../ThemedText';

describe('ThemedText', () => {
  it('renders correctly', () => {
    render(<ThemedText>Test</ThemedText>);
  });
});
