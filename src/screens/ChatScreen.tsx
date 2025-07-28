import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getConversationMessages, Message, sendMessageToMatrixRoom } from '@/services/api';
import i18n from '@/localization/i18n';

export default function ChatScreen() {
  const params = useLocalSearchParams<{ conversationId: string; participantName?: string; receiverId?: string, roomId?: string }>();
  const conversationId = params.conversationId;
  const receiverId = params.receiverId;
  const roomId = params.roomId;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUserId = 'current_user_id_placeholder';

  // const fetchMessages = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const fetchedMessages = await getConversationMessages(conversationId);
  //     setMessages(fetchedMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
  //   } catch (err: any) {
  //     setError(err.message || 'Failed to fetch messages.');
  //     Alert.alert('Error', err.message || 'Failed to fetch messages.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    // fetchMessages();
  }, [conversationId]);

  const handleSend = async () => {
    if (newMessage.trim().length === 0) return;
    if (!roomId) {
      Alert.alert("Error", "Room ID is missing. Cannot send message.");
      return;
    }

    setSending(true);
    try {
      await sendMessageToMatrixRoom(roomId, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'An error occurred while sending the message.');
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
        <View style={styles.disclaimer}>
          <ThemedText style={styles.disclaimerText}>
            {i18n.t('messages_not_restored')}
          </ThemedText>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder={i18n.t('type_a_message')}
            editable={!sending}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton} disabled={sending}>
            <ThemedText style={styles.sendButtonText}>{sending ? i18n.t('sending') : i18n.t('send')}</ThemedText>
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
