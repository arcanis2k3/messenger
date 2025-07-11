// This will be the central place for API configurations and calls.
import axios from 'axios'; // Using axios for HTTP requests

// Assume this is your backend API base URL
// From the backend dev info, many routes are prefixed with /api/v1 or just /
// The /users/me endpoint is mentioned under api/main.py -> user_profile_router (/users/me)
// The main FastAPI app might be at localhost:8000.
// Let's assume the full base path for user profile is directly under the host.
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000'; // Default for local dev

interface UserProfile {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_superuser: boolean;
  profile_picture_url?: string | null; // This field might not exist directly
  // profile_picture object might contain more details like file_id, url
  // Based on "user_profile_router (/users/me): Manages user profile updates (details, password, profile picture)."
  // And MediaEncryptionService, the profile picture might be a separate fetch or a pre-signed URL.
  // For now, let's assume UserResponse from api/models.py is returned by /users/me
}

// Function to get the authentication token
// This is a placeholder. In a real app, you'd get this from AsyncStorage, Redux store, Zustand, etc.
const getAuthToken = async (): Promise<string | null> => {
  // Example: return await AsyncStorage.getItem('userToken');
  // For now, returning a mock token if needed for testing, or null
  return 'mock-jwt-token'; // Replace with actual token retrieval
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the auth token to requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getMyProfile = async (): Promise<UserProfile> => {
  try {
    // The backend doc mentions: user_profile_router (/users/me)
    const response = await apiClient.get<UserProfile>('/users/me');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    // It's good practice to throw a custom error or handle it appropriately
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`API Error (${error.response.status}): ${error.response.data.detail || error.message}`);
    }
    throw new Error('Failed to fetch profile due to an unknown error.');
  }
};

// Placeholder for updating profile picture
// The backend doc says "/users/me" manages profile picture updates.
// This usually means a PUT or POST request with FormData.
export const updateUserProfilePicture = async (formData: FormData): Promise<UserProfile> => {
  try {
    const response = await apiClient.put<UserProfile>('/users/me/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // Note: The backend might have a specific endpoint like /users/me/profile-picture
    // The provided doc says "user_profile_router (/users/me): Manages user profile updates (details, password, profile picture)."
    // Let's assume PUT to /users/me or a sub-route like /users/me/profile-picture
    // The backend info for `user_profile_router` implies it handles profile picture updates.
    // Let's assume a dedicated sub-endpoint for clarity or that the main /users/me endpoint can handle FormData for picture update.
    // The admin endpoint GET /admin/users/{user_id}/profile-picture/view suggests pictures are linked to users.
    // For now, I'll use a hypothetical PUT /users/me/profile-picture
    return response.data;
  } catch (error) {
    console.error('Failed to update profile picture:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`API Error (${error.response.status}): ${error.response.data.detail || error.message}`);
    }
    throw new Error('Failed to update profile picture due to an unknown error.');
  }
};


export const updateUserDisplayName = async (displayName: string): Promise<UserProfile> => {
  try {
    // The backend doc says "/users/me" manages user profile updates (details, password, profile picture).
    // This implies a PUT or PATCH request to /users/me with the new details.
    // The UserResponse model in api/models.py would be relevant here.
    // Let's assume we send an object like { "full_name": "New Name" }
    const response = await apiClient.put<UserProfile>('/users/me', { full_name: displayName });
    return response.data;
  } catch (error) {
    console.error('Failed to update display name:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`API Error (${error.response.status}): ${error.response.data.detail || error.message}`);
    }
    throw new Error('Failed to update display name due to an unknown error.');
  }
};


// Messenger API functions
interface Message {
    id: string; // or number
    conversation_id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    timestamp: string; // ISO date string
    is_read?: boolean;
}

interface Conversation {
    id: string; // or number
    user1_id: string;
    user2_id: string;
    created_at: string;
    last_message_at: string;
    // Potentially include participant profiles or last message snippet
    participant_profile?: { username: string, profile_picture_url?: string | null };
    last_message_content?: string | null;
}

// From backend: POST /messenger/messages
export const sendMessage = async (receiverId: string, content: string): Promise<Message> => {
    try {
        const response = await apiClient.post<Message>('/messenger/messages', {
            receiver_id: receiverId, // Assuming the backend expects receiver_id and content
            content: content,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to send message:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`API Error (${error.response.status}): ${error.response.data.detail || error.message}`);
        }
        throw new Error('Failed to send message due to an unknown error.');
    }
};

// From backend: GET /messenger/conversations
export const getConversations = async (): Promise<Conversation[]> => {
    try {
        const response = await apiClient.get<Conversation[]>('/messenger/conversations');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch conversations:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`API Error (${error.response.status}): ${error.response.data.detail || error.message}`);
        }
        throw new Error('Failed to fetch conversations due to an unknown error.');
    }
};

// From backend: GET /messenger/conversations/{conversation_id}/messages
export const getConversationMessages = async (conversationId: string): Promise<Message[]> => {
    try {
        const response = await apiClient.get<Message[]>(`/messenger/conversations/${conversationId}/messages`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch messages for conversation:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`API Error (${error.response.status}): ${error.response.data.detail || error.message}`);
        }
        throw new Error('Failed to fetch messages for conversation due to an unknown error.');
    }
};

// Note: WebSocket connections are typically handled differently, not via axios.
// This service file would be for HTTP API calls. WebSocket logic would be separate.

export default apiClient;
