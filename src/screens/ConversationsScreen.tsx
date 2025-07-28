import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect, router } from 'expo-router'; // Changed to router from expo-router
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getConversations, Conversation } from '@/services/api'; // Assuming Conversation interface is exported from api.ts
import i18n from '@/localization/i18n';


export default function ConversationsScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const fetchConversationsList = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const convos = await getConversations();
  //     // Ensure participant_profile is at least an empty object if null/undefined
  //     const processedConvos = convos.map(c => ({ ...c, participant_profile: c.participant_profile || {} }));
  //     setConversations(processedConvos);
  //   } catch (err: any) {
  //     setError(err.message || 'Failed to fetch conversations.');
  //     Alert.alert('Error', err.message || 'Failed to fetch conversations.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // useFocusEffect to refetch conversations when the screen comes into focus
  // useFocusEffect(
  //   useCallback(() => {
  //     fetchConversationsList();
  //     // Optional: Set up listener for new messages/conversations from WebSocket here
  //     return () => {
  //       // Optional: Clean up listener
  //     };
  //   }, [])
  // );

  const handleSelectConversation = (conversation: Conversation) => {
    // Placeholder for current user ID - this should come from an auth context/store
    const currentUserIdPlaceholder = "user_id_1"; // Replace with actual current user ID

    const receiverId = conversation.user1_id === currentUserIdPlaceholder
      ? conversation.user2_id
      : conversation.user1_id;

    const participantName = conversation.participant_profile?.username ||
                          (receiverId === conversation.user1_id ? 'User1' : 'User2'); // Fallback name


    // Navigate to ChatScreen using expo-router
    router.push({
      pathname: '/messages/chat', // Path to the chat screen file
      params: {
        conversationId: conversation.id.toString(),
        participantName: participantName,
        receiverId: receiverId.toString(), // Pass the determined receiver ID
      }
    });
  };

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centered}>
<ThemedText type="defaultSemiBold">{i18n.t('error')}</ThemedText>
        <ThemedText>{error}</ThemedText>
        <TouchableOpacity onPress={fetchConversationsList} style={styles.button}>
            <ThemedText style={styles.buttonText}>{i18n.t('retry')}</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  if (conversations.length === 0) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>{i18n.t('no_conversations')}</ThemedText>
         <TouchableOpacity onPress={fetchConversationsList} style={styles.button}>
            <ThemedText style={styles.buttonText}>{i18n.t('refresh')}</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.disclaimer}>
        <ThemedText style={styles.disclaimerText}>
          {i18n.t('messages_not_restored')}
        </ThemedText>
      </View>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.conversationItem} onPress={() => handleSelectConversation(item)}>
            {/* Adjust display based on Conversation model details */}
            <ThemedText style={styles.conversationName}>
              {i18n.t('conversation_with')} {item.participant_profile?.username || `User ${item.user2_id}`}
            </ThemedText>
            <ThemedText style={styles.lastMessage}>
              {item.last_message_content || 'No messages yet.'}
            </ThemedText>
          </TouchableOpacity>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    flex: 1,
  },
  conversationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee', // Use theme color later
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666', // Use theme color later
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  disclaimer: {
    padding: 10,
    backgroundColor: '#f8d7da',
    alignItems: 'center',
  },
  disclaimerText: {
    color: '#721c24',
    fontSize: 12,
  },
});
