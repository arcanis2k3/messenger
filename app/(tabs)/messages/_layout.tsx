import { Stack } from 'expo-router';
import React from 'react';

export default function MessagesStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index" // This will be app/(tabs)/messages/index.tsx
        options={{ headerShown: true, title: 'Conversations' }}
      />
      <Stack.Screen
        name="chat"  // This will be app/(tabs)/messages/chat.tsx
        options={{ headerShown: true, title: 'Chat' }} // Title can be dynamic
      />
    </Stack>
  );
}
