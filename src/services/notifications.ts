import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async registerForPushNotificationsAsync(): Promise<string | undefined> {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  public async schedulePushNotification(title: string, body: string, data: any) {
    const settings = await AsyncStorage.getItem('notification_settings');
    if (settings) {
      const { isEnabled, notificationType } = JSON.parse(settings);
      if (isEnabled) {
        let notificationTitle = '';
        let notificationBody = '';

        switch (notificationType) {
          case 'content':
            notificationTitle = title;
            notificationBody = body;
            break;
          case 'partial':
            notificationTitle = title;
            notificationBody = body.substring(0, 50) + '...';
            break;
          case 'sender':
            notificationTitle = title;
            notificationBody = 'New message';
            break;
          case 'none':
            notificationTitle = 'New message';
            notificationBody = '';
            break;
          default:
            return;
        }

        await Notifications.scheduleNotificationAsync({
          content: {
            title: notificationTitle,
            body: notificationBody,
            data,
          },
          trigger: { seconds: 1 },
        });
      }
    }
  }
}

export default NotificationService.getInstance();
