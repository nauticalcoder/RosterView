import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import PlayerList from '@/components/PlayerList';
import { useSelectedTeams } from '@/context/SelectedTeams';
import { useRosters } from '@/context/Rosters';

export default function HomeTeamScreen() {
  const { homeTeamName } = useSelectedTeams();
  const { getRoster } = useRosters();

  return (
    <View style={styles.container}>
      <PlayerList teamName={homeTeamName} roster={getRoster(homeTeamName)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
