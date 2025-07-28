import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { searchUsersByEmail, createMatrixRoom } from '@/services/api';
import { router } from 'expo-router';

export default function AddFriendScreen() {
  const [email, setEmail] = useState('');

  const handleSearch = async () => {
    if (email.trim() === '') {
      Alert.alert('Error', 'Please enter an email address.');
      return;
    }

    try {
      const users = await searchUsersByEmail(email.trim());

      if (users.length === 0) {
        Alert.alert('User not found', 'No user found with that email address.');
      } else {
        const user = users[0];

        const room = await createMatrixRoom(`Chat with ${user.email}`, `A private chat with ${user.email}`, false);

        // Navigate to chat screen with the found user and room ID
        router.push({
          pathname: '/messages/chat',
          params: {
            receiverId: user.id,
            participantName: user.email,
            roomId: room.room_id,
          },
        });

      }
    } catch (error) {
      console.error('Error searching for user:', error);
      Alert.alert('Error', 'An error occurred while searching for the user.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Add Friend</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Enter friend's email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title="Search" onPress={handleSearch} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: 'white',
  },
});
