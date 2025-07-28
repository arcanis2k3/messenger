import { Stack } from 'expo-router';
import React from 'react';

export default function FriendsLayout() {
  return (
    <Stack>
      <Stack.Screen name="add" options={{ headerShown: false }} />
    </Stack>
  );
}
