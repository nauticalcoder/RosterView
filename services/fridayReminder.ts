import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { router, type Href } from 'expo-router';
import { loadFridayReminderEnabled, saveFridayReminderEnabled } from '@/utils/reminderStorage';

export const FRIDAY_REMINDER_ID = 'friday-roster-reminder';
export const FRIDAY_REMINDER_CHANNEL = 'roster-reminders';
export const FRIDAY_REMINDER_WEEKDAY = 6;
export const FRIDAY_REMINDER_HOUR = 16;
export const SETTINGS_URL = '/settings';

export function notificationsSupported() {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

function permissionGranted(settings: Notifications.NotificationPermissionsStatus) {
  return (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export function configureNotificationHandler() {
  if (!notificationsSupported()) {
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(FRIDAY_REMINDER_CHANNEL, {
    name: 'Roster reminders',
    importance: Notifications.AndroidImportance.HIGH,
  });
}

export async function requestReminderPermission(): Promise<boolean> {
  if (!notificationsSupported()) {
    return false;
  }

  await ensureAndroidChannel();
  const existing = await Notifications.getPermissionsAsync();
  if (permissionGranted(existing)) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync();
  return permissionGranted(requested);
}

export async function scheduleFridayReminder(): Promise<void> {
  if (!notificationsSupported()) {
    throw new Error('Reminders are only available on iOS and Android');
  }

  const allowed = await requestReminderPermission();
  if (!allowed) {
    throw new Error('Notification permission is required for the Friday reminder');
  }

  await Notifications.cancelScheduledNotificationAsync(FRIDAY_REMINDER_ID);
  await Notifications.scheduleNotificationAsync({
    identifier: FRIDAY_REMINDER_ID,
    content: {
      title: "Set this week's teams",
      body: 'Pick home and visiting teams, then tap Refresh Rosters.',
      data: { url: SETTINGS_URL },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: FRIDAY_REMINDER_WEEKDAY,
      hour: FRIDAY_REMINDER_HOUR,
      minute: 0,
      channelId: Platform.OS === 'android' ? FRIDAY_REMINDER_CHANNEL : undefined,
    },
  });
  await saveFridayReminderEnabled(true);
}

export async function cancelFridayReminder(): Promise<void> {
  if (notificationsSupported()) {
    await Notifications.cancelScheduledNotificationAsync(FRIDAY_REMINDER_ID);
  }
  await saveFridayReminderEnabled(false);
}

export async function restoreFridayReminderIfEnabled(): Promise<void> {
  if (!notificationsSupported()) {
    return;
  }
  const enabled = await loadFridayReminderEnabled();
  if (enabled) {
    await scheduleFridayReminder();
  }
}

function redirectFromNotification(notification: Notifications.Notification) {
  const url = notification.request.content.data?.url;
  if (typeof url === 'string') {
    router.push(url as Href);
  }
}

export function observeNotificationResponses() {
  if (!notificationsSupported()) {
    return () => {};
  }

  const lastResponse = Notifications.getLastNotificationResponse();
  if (lastResponse?.notification) {
    redirectFromNotification(lastResponse.notification);
  }

  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    redirectFromNotification(response.notification);
  });

  return () => subscription.remove();
}
