import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <Image source={require('@/assets/images/golden_z512x512.png')} style={styles.logo} />
      <ThemedText style={styles.title}>Z Messenger</ThemedText>
      <View style={styles.grid}>
        <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/messages')}>
          <Ionicons name="ios-mail" size={64} color="black" />
          <ThemedText>Conversations</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/friends/add')}>
          <View>
            <Ionicons name="ios-people" size={64} color="black" />
            <View style={styles.plusIcon}>
              <Ionicons name="ios-add" size={24} color="white" />
            </View>
          </View>
          <ThemedText>Add Friend</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/settings')}>
          <Ionicons name="ios-settings" size={64} color="black" />
          <ThemedText>Settings</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/profile')}>
          <Ionicons name="ios-person" size={64} color="black" />
          <ThemedText>Profile</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  gridItem: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  plusIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'green',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
