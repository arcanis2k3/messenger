import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; // Changed to useLocalSearchParams
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getConversationMessages, sendMessage, Message } from '@/services/api'; // Assuming Message interface is exported

export default function ChatScreen() {
  const params = useLocalSearchParams<{ conversationId: string; participantName?: string; receiverId?: string }>();
  const conversationId = params.conversationId;
  const receiverId = params.receiverId; // Use this for sending messages
  // const participantName = params.participantName; // Can be used for header title, etc.


  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Placeholder for current user ID - this should come from auth context/store
  const currentUserId = 'current_user_id_placeholder';

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedMessages = await getConversationMessages(conversationId);
      setMessages(fetchedMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch messages.');
      Alert.alert('Error', err.message || 'Failed to fetch messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // TODO: Setup WebSocket listener for new messages in this conversation
    // And cleanup on unmount
  }, [conversationId]);

  const handleSend = async () => {
    if (newMessage.trim().length === 0) return;
    // The backend `sendMessage` needs `receiverId` and `content`.
    // We need to determine receiverId from conversationId or participant details.
    // This is a simplification; the backend might infer receiver from conversation_id or need explicit receiver_id.
    // The receiverId is now passed as a route parameter.
    if (!receiverId) {
        Alert.alert("Error", "Recipient ID is missing. Cannot send message.");
        return;
    }

    setSending(true);
    try {
      // Ensure receiverId is a string, as expected by sendMessage function (based on current api.ts)
      const sentMessage = await sendMessage(receiverId.toString(), newMessage.trim());
      setMessages(prevMessages => [...prevMessages, sentMessage].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
      setNewMessage('');
      // TODO: Also send via WebSocket. The backend should also push this message
      // to the recipient via WebSocket. The sender might also receive a WebSocket message
      // for sync across devices, or can rely on this optimistic update.
    } catch (err: any) {
      Alert.alert('Send Error', err.message || 'Failed to send message.');
      console.error("Send message error:", err); // Log for more details
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <ThemedView style={styles.centered}><ActivityIndicator size="large" /></ThemedView>;
  }

  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText type="defaultSemiBold">Error:</ThemedText>
        <ThemedText>{error}</ThemedText>
         <TouchableOpacity onPress={fetchMessages} style={styles.button}>
            <ThemedText style={styles.buttonText}>Retry</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} // Adjust as needed
    >
      <ThemedView style={styles.containerInner}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[
              styles.messageBubble,
              item.sender_id === currentUserId ? styles.myMessage : styles.theirMessage
            ]}>
              <Text style={item.sender_id === currentUserId ? styles.myMessageText : styles.theirMessageText}>
                {item.content}
              </Text>
              <Text style={styles.timestamp}>
                {new Date(item.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.messagesContainer}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            editable={!sending}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton} disabled={sending}>
            <ThemedText style={styles.sendButtonText}>{sending ? '...' : 'Send'}</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  containerInner: {
    flex: 1, // Ensure ThemedView takes up space within KeyboardAvoidingView
    // backgroundColor might be needed if ThemedView doesn't provide one by default
  },
  messagesContainer: {
    padding: 10,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: '#007AFF', // My message color
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  theirMessage: {
    backgroundColor: '#E5E5EA', // Their message color
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  myMessageText: {
    color: 'white',
  },
  theirMessageText: {
    color: 'black',
  },
  timestamp: {
    fontSize: 10,
    color: '#999', // Adjust color based on bubble background
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc', // Use theme color later
    // backgroundColor: 'white', // Ensure visibility
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: 'white', // Ensure visibility
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
});
