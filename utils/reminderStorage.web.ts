const FRIDAY_REMINDER_ENABLED_KEY = 'fridayReminderEnabled';

export async function loadFridayReminderEnabled(): Promise<boolean> {
  return window.localStorage.getItem(FRIDAY_REMINDER_ENABLED_KEY) === 'true';
}

export async function saveFridayReminderEnabled(enabled: boolean): Promise<void> {
  window.localStorage.setItem(FRIDAY_REMINDER_ENABLED_KEY, enabled ? 'true' : 'false');
}
