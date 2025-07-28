import axios from 'axios';
import { getAuth } from 'firebase/auth';

const API_BASE_URL = 'https://chat.zmodelz.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getAccessToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const sendMessage = async (receiverId: number, content: string) => {
  const response = await apiClient.post('/messenger/messages', {
    receiver_id: receiverId,
    content,
  });
  return response.data;
};

export const getConversations = async () => {
  const response = await apiClient.get('/messenger/conversations');
  return response.data;
};

export const getConversationMessages = async (conversationId: number) => {
  const response = await apiClient.get(
    `/messenger/conversations/${conversationId}/messages`
  );
  return response.data;
};

export const searchUsersByEmail = async (email: string) => {
  const response = await apiClient.get(`/users/search?email=${email}`);
  return response.data;
};

export const createMatrixUser = async (username: string, password: string) => {
    const response = await apiClient.post('/api/v1/matrix/users', {
        username,
        password,
    });
    return response.data;
}

export const createMatrixRoom = async (name: string, topic: string, isPublic: boolean) => {
    const response = await apiClient.post('/api/v1/matrix/rooms', {
        name,
        topic,
        is_public: isPublic,
    });
    return response.data;
}

export const sendMessageToMatrixRoom = async (roomId: string, message: string) => {
    const response = await apiClient.post(`/api/v1/matrix/rooms/${roomId}/messages`, {
        message,
    });
    return response.data;
}

export const getPresignedUrl = async (filename: string) => {
    const response = await apiClient.get(`/profile-pic/presigned-url?filename=${filename}`);
    return response.data;
}

export const saveUserSettings = async (settings: any) => {
    const response = await apiClient.post('/messenger/settings', settings);
    return response.data;
}

export const getUserSettings = async () => {
    const response = await apiClient.get('/messenger/settings');
    return response.data;
}

export default apiClient;
