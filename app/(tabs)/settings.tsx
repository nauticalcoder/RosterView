import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Text, View, useThemeColor } from '@/components/Themed';
import TeamDropdown from '@/components/TeamDropdown';
import { ncaaFootballTeams } from '@/constants/ncaaFootballTeams';
import { useSelectedTeams } from '@/context/SelectedTeams';
import { useRosters } from '@/context/Rosters';
import toast from '@/services/toast';
import {
  cancelFridayReminder,
  notificationsSupported,
  scheduleFridayReminder,
} from '@/services/fridayReminder';
import { loadFridayReminderEnabled } from '@/utils/reminderStorage';

function formatUpdatedAt(iso: string | undefined) {
  if (!iso) {
    return 'Never';
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleString();
}

export default function SettingsScreen() {
  const {
    homeTeamName,
    visitingTeamName,
    setHomeTeamName,
    setVisitingTeamName,
  } = useSelectedTeams();
  const { getRoster, isRefreshing, refreshSelectedRosters } = useRosters();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderBusy, setReminderBusy] = useState(false);
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const remindersAvailable = notificationsSupported();

  useEffect(() => {
    loadFridayReminderEnabled()
      .then(setReminderEnabled)
      .catch((error) => {
        console.warn('Failed to load Friday reminder setting', error);
      });
  }, []);

  const homeRoster = getRoster(homeTeamName);
  const visitingRoster = getRoster(visitingTeamName);
  const canRefresh = Boolean(homeTeamName && visitingTeamName);

  const onRefresh = async () => {
    if (!canRefresh) {
      toast('Select a home team and visiting team first');
      return;
    }
    setErrorMessage(undefined);
    try {
      await refreshSelectedRosters();
      toast('Rosters updated');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to refresh rosters';
      setErrorMessage(message);
      toast(message);
    }
  };

  const onToggleReminder = async (enabled: boolean) => {
    if (!remindersAvailable) {
      toast('Reminders are only available on iOS and Android');
      return;
    }

    setReminderBusy(true);
    try {
      if (enabled) {
        await scheduleFridayReminder();
        setReminderEnabled(true);
        toast('Reminder set for Fridays at 4:00 PM');
      } else {
        await cancelFridayReminder();
        setReminderEnabled(false);
        toast('Friday reminder turned off');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update reminder';
      setReminderEnabled(false);
      toast(message);
    } finally {
      setReminderBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <Spinner visible={isRefreshing} textContent="Refreshing rosters..." />
      <ScrollView contentContainerStyle={styles.scrollContent}>

      <TeamDropdown
        label="Home Team"
        teams={ncaaFootballTeams}
        selectedName={homeTeamName}
        onSelect={setHomeTeamName}
      />
      <Text style={styles.updated}>
        Home roster updated: {formatUpdatedAt(homeRoster?.updatedAt)}
      </Text>

      <TeamDropdown
        label="Visiting Team"
        teams={ncaaFootballTeams}
        selectedName={visitingTeamName}
        onSelect={setVisitingTeamName}
      />
      <Text style={styles.updated}>
        Visiting roster updated: {formatUpdatedAt(visitingRoster?.updatedAt)}
      </Text>

      <Pressable
        accessibilityRole="button"
        disabled={!canRefresh || isRefreshing}
        onPress={onRefresh}
        style={({ pressed }) => [
          styles.button,
          { borderColor: textColor, backgroundColor: tintColor },
          (!canRefresh || isRefreshing) && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonLabel}>Refresh Rosters</Text>
      </Pressable>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <View style={styles.reminderRow}>
        <View style={styles.reminderCopy}>
          <Text style={styles.reminderTitle}>Friday 4:00 PM reminder</Text>
          <Text style={styles.reminderBody}>
            {remindersAvailable
              ? 'Get a weekly notification to set teams and refresh rosters.'
              : 'Reminders are only available on iOS and Android.'}
          </Text>
        </View>
        <Switch
          value={reminderEnabled}
          onValueChange={onToggleReminder}
          disabled={!remindersAvailable || reminderBusy}
          trackColor={{ true: tintColor }}
        />
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  updated: {
    fontSize: 13,
    opacity: 0.85,
    marginTop: -12,
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    marginTop: 12,
    fontSize: 14,
  },
  reminderRow: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  reminderCopy: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reminderBody: {
    fontSize: 13,
    opacity: 0.85,
  },
});
