import Storage from 'expo-sqlite/kv-store';

const FRIDAY_REMINDER_ENABLED_KEY = 'fridayReminderEnabled';

export async function loadFridayReminderEnabled(): Promise<boolean> {
  const value = await Storage.getItemAsync(FRIDAY_REMINDER_ENABLED_KEY);
  return value === 'true';
}

export async function saveFridayReminderEnabled(enabled: boolean): Promise<void> {
  await Storage.setItemAsync(FRIDAY_REMINDER_ENABLED_KEY, enabled ? 'true' : 'false');
}
