import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Text, View, useThemeColor } from '@/components/Themed';
import TeamDropdown from '@/components/TeamDropdown';
import { ncaaFootballTeams } from '@/constants/ncaaFootballTeams';
import { useSelectedTeams } from '@/context/SelectedTeams';
import { useRosters } from '@/context/Rosters';
import toast from '@/services/toast';

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
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

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

  return (
    <View style={styles.container}>
      <Spinner visible={isRefreshing} textContent="Refreshing rosters..." />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
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
});
