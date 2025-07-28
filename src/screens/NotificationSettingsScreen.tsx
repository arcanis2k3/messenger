import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const NOTIFICATION_SETTINGS_KEY = 'notification_settings';

export default function NotificationSettingsScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [notificationType, setNotificationType] = useState('content');

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (settings) {
        const { isEnabled, notificationType } = JSON.parse(settings);
        setIsEnabled(isEnabled);
        setNotificationType(notificationType);
      }
    };
    loadSettings();
  }, []);

  const saveSettings = async (newIsEnabled: boolean, newNotificationType: string) => {
    setIsEnabled(newIsEnabled);
    setNotificationType(newNotificationType);
    const settings = JSON.stringify({ isEnabled: newIsEnabled, notificationType: newNotificationType });
    await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY, settings);
  };

  const toggleSwitch = () => {
    saveSettings(!isEnabled, notificationType);
  };

  const selectNotificationType = (type: string) => {
    saveSettings(isEnabled, type);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.settingRow}>
        <ThemedText>Enable Notifications</ThemedText>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>

      {isEnabled && (
        <View>
          <TouchableOpacity style={styles.optionRow} onPress={() => selectNotificationType('content')}>
            <ThemedText>Show content</ThemedText>
            {notificationType === 'content' && <ThemedText style={styles.checkmark}>✓</ThemedText>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionRow} onPress={() => selectNotificationType('partial')}>
            <ThemedText>Show partial content</ThemedText>
            {notificationType === 'partial' && <ThemedText style={styles.checkmark}>✓</ThemedText>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionRow} onPress={() => selectNotificationType('sender')}>
            <ThemedText>Show sender only</ThemedText>
            {notificationType === 'sender' && <ThemedText style={styles.checkmark}>✓</ThemedText>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionRow} onPress={() => selectNotificationType('none')}>
            <ThemedText>Show "New message" only</ThemedText>
            {notificationType === 'none' && <ThemedText style={styles.checkmark}>✓</ThemedText>}
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  checkmark: {
    fontSize: 20,
    color: '#007AFF',
  },
});
