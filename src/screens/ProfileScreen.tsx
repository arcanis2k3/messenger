import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Platform, TextInput, View } from 'react-native'; // Added View, TextInput
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getMyProfile, updateUserProfilePicture, updateUserDisplayName, getPresignedUrl } from '@/services/api'; // Added updateUserDisplayName
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

// UserProfile interface based on UserResponse model and expected data
interface UserProfile {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_superuser: boolean;
  profile_picture_url?: string | null; // This might come from a different field or need construction
                                      // For now, assuming it's directly available or handled by the backend response.
}

export default function ProfileScreen() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false);
  const [savingDisplayName, setSavingDisplayName] = useState(false);


  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await getMyProfile();
      setUser(profileData);
      setDisplayName(profileData.full_name || profileData.username || ''); // Initialize display name input
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile.');
      if (!user) {
        Alert.alert('Error fetching profile', err.message || 'Failed to fetch profile.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDisplayName = async () => {
    if (!user) return; // Guard clause if user is null
    if (displayName.trim() === (user.full_name || user.username)) {
      setIsEditingDisplayName(false);
      setDisplayName(user.full_name || user.username || ''); // Reset to original if no change
      return;
    }
    try {
      setSavingDisplayName(true);
      const updatedProfile = await updateUserDisplayName(displayName.trim());
      setUser(updatedProfile); // Update the user state with the full response
      setDisplayName(updatedProfile.full_name || updatedProfile.username || ''); // Update local display name state
      setIsEditingDisplayName(false);
      Alert.alert('Success', 'Display name updated!');
    } catch (err: any) {
      Alert.alert('Save Error', err.message || 'Failed to update display name.');
      console.error('Save display name error:', err);
    } finally {
      setSavingDisplayName(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChoosePhoto = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const uri = asset.uri;

      try {
        setUploading(true);

        const { url } = await getPresignedUrl(uri.split('/').pop()!);

        const response = await fetch(uri);
        const blob = await response.blob();

        await axios.put(url, blob, {
          headers: {
            'Content-Type': blob.type,
          },
        });

        // Refetch the profile to get the new profile picture URL
        await fetchProfile();

        Alert.alert('Success', 'Profile picture updated!');
      } catch (err: any) {
        Alert.alert('Upload Error', err.message || 'Failed to upload profile picture.');
        console.error('Upload error:', err);
      } finally {
        setUploading(false);
      }
    }
  };


  if (loading && !user) { // Show initial loading indicator only if no user data yet
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error && !user) { // Show error only if there's no user data to display
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="defaultSemiBold">Error:</ThemedText>
        <ThemedText>{error}</ThemedText>
        <TouchableOpacity onPress={fetchProfile} style={styles.button}>
          <ThemedText style={styles.buttonText}>Retry</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  if (!user) {
    // This case should ideally be covered by loading or error states if fetchProfile is always called
    return (
      <ThemedView style={styles.container}>
        <ThemedText>No user data found. Try refreshing.</ThemedText>
        <TouchableOpacity onPress={fetchProfile} style={styles.button}>
          <ThemedText style={styles.buttonText}>Refresh</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  // If there's an error but we have old user data, we can show the data and an error message.
  // For simplicity here, error primarily blocks rendering if no user data is available.

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Profile</ThemedText>

      {error && <ThemedText style={{color: 'red', marginBottom: 10}}>{error}</ThemedText>}

      <TouchableOpacity onPress={handleChoosePhoto}>
        {user.profile_picture_url ? (
          <Image source={{ uri: user.profile_picture_url }} style={styles.profileImage} />
        ) : (
          <ThemedView style={[styles.profileImage, styles.placeholderImage]}>
            <ThemedText>No Image</ThemedText>
            <ThemedText style={{fontSize: 10}}>(Tap to Select)</ThemedText>
          </ThemedView>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={handleChoosePhoto} style={styles.button}>
        <ThemedText style={styles.buttonText}>
          {uploading ? 'Uploading...' : 'Change Profile Picture'}
        </ThemedText>
      </TouchableOpacity>
      {uploading && <ActivityIndicator style={{marginTop: 10, marginBottom:10}} />}

      <View style={styles.fieldContainer}>
        <ThemedText type="subtitle" style={styles.label}>Display Name:</ThemedText>
        {!isEditingDisplayName ? (
          <View style={styles.displayNameView}>
            <ThemedText style={styles.value}>{user.full_name || user.username}</ThemedText>
            <TouchableOpacity onPress={() => {
              setDisplayName(user.full_name || user.username || ''); // Ensure input starts with current value
              setIsEditingDisplayName(true);
            }} style={styles.editButton}>
              <ThemedText style={styles.editButtonText}>Edit</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.editDisplayNameContainer}>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Enter display name"
              autoFocus
            />
            <View style={styles.editButtonsContainer}>
              <TouchableOpacity onPress={handleSaveDisplayName} style={[styles.button, styles.saveButton]} disabled={savingDisplayName}>
                <ThemedText style={styles.buttonText}>{savingDisplayName ? 'Saving...' : 'Save'}</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setIsEditingDisplayName(false);
                setDisplayName(user.full_name || user.username || ''); // Reset changes
              }} style={[styles.button, styles.cancelButton]} disabled={savingDisplayName}>
                <ThemedText style={styles.buttonText}>Cancel</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <ThemedText type="subtitle" style={styles.label}>Username:</ThemedText>
        <ThemedText style={styles.value}>{user.username}</ThemedText>
      </View>

      <View style={styles.fieldContainer}>
        <ThemedText type="subtitle" style={styles.label}>Email:</ThemedText>
        <ThemedText style={styles.value}>{user.email}</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10, // Reduced margin a bit
    backgroundColor: '#ccc', // Placeholder background
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF', // Standard blue color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  label: {
    marginTop: 15,
    alignSelf: 'flex-start',
    fontWeight: 'bold', // Make labels bolder
  },
  value: {
    fontSize: 16,
    alignSelf: 'flex-start',
    marginLeft: 10, // Indent value slightly
  }
});
