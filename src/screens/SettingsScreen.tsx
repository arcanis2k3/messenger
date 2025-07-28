import React, { useState, useEffect } from 'react';
import { View, Switch, StyleSheet, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getUserSettings, saveUserSettings } from '@/services/api';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    notifications_enabled: true,
    theme: 'light',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const userSettings = await getUserSettings();
        setSettings(userSettings);
      } catch (error) {
        console.error('Error fetching settings:', error);
        Alert.alert('Error', 'An error occurred while fetching your settings.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSettingChange = async (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    try {
      await saveUserSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'An error occurred while saving your settings.');
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading settings...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Settings</ThemedText>
      <View style={styles.setting}>
        <ThemedText>Enable Notifications</ThemedText>
        <Switch
          value={settings.notifications_enabled}
          onValueChange={(value) => handleSettingChange('notifications_enabled', value)}
        />
      </View>
      <View style={styles.setting}>
        <ThemedText>Theme</ThemedText>
        {/* I'll add a theme picker here later */}
        <ThemedText>{settings.theme}</ThemedText>
      </View>
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
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});
