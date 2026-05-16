import { Expo } from 'expo-server-sdk';
import { env } from '../config/env';
import { NotificationModel } from '../models/Notification';
import { UserModel } from '../models/User';

const expo = new Expo({
  accessToken: env.EXPO_ACCESS_TOKEN
});

export const notificationService = {
  async createInAppNotification(userId: string, title: string, message: string, type: 'order' | 'offer' | 'system', orderId?: string) {
    return NotificationModel.create({ userId, title, message, type, orderId });
  },

  async sendPushToUsers(userIds: string[], title: string, body: string, data: Record<string, unknown>) {
    const users = await UserModel.find({ _id: { $in: userIds } }).lean();
    const messages = users
      .flatMap((user) => user.expoPushTokens ?? [])
      .filter((token) => Expo.isExpoPushToken(token))
      .map((token) => ({
        to: token,
        sound: 'default' as const,
        title,
        body,
        data
      }));

    if (messages.length > 0) {
      await expo.sendPushNotificationsAsync(messages);
    }
  }
};
