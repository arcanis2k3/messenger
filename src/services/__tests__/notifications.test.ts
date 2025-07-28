import NotificationService from '../notifications';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

describe('NotificationService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should schedule a notification with full content', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ isEnabled: true, notificationType: 'content' })
    );

    await NotificationService.schedulePushNotification('Sender', 'Hello, world!', {});

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
      content: {
        title: 'Sender',
        body: 'Hello, world!',
        data: {},
      },
      trigger: { seconds: 1 },
    });
  });

  it('should schedule a notification with partial content', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ isEnabled: true, notificationType: 'partial' })
    );

    await NotificationService.schedulePushNotification('Sender', 'This is a very long message that should be truncated.', {});

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
      content: {
        title: 'Sender',
        body: 'This is a very long message that should be trunca...',
        data: {},
      },
      trigger: { seconds: 1 },
    });
  });

  it('should schedule a notification with sender only', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ isEnabled: true, notificationType: 'sender' })
    );

    await NotificationService.schedulePushNotification('Sender', 'You have a new message.', {});

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
      content: {
        title: 'Sender',
        body: 'New message',
        data: {},
      },
      trigger: { seconds: 1 },
    });
  });

  it('should schedule a notification with no content', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ isEnabled: true, notificationType: 'none' })
    );

    await NotificationService.schedulePushNotification('Sender', 'You have a new message.', {});

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
      content: {
        title: 'New message',
        body: '',
        data: {},
      },
      trigger: { seconds: 1 },
    });
  });

  it('should not schedule a notification if disabled', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ isEnabled: false, notificationType: 'content' })
    );

    await NotificationService.schedulePushNotification('Sender', 'Hello, world!', {});

    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });
});
