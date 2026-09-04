import Storage from 'expo-sqlite/kv-store';

const HOME_TEAM_KEY = 'selectedHomeTeamName';
const VISITING_TEAM_KEY = 'selectedVisitingTeamName';

export async function loadSelectedTeams(): Promise<{
  homeTeamName?: string;
  visitingTeamName?: string;
}> {
  const [homeTeamName, visitingTeamName] = await Promise.all([
    Storage.getItemAsync(HOME_TEAM_KEY),
    Storage.getItemAsync(VISITING_TEAM_KEY),
  ]);

  return {
    homeTeamName: homeTeamName ?? undefined,
    visitingTeamName: visitingTeamName ?? undefined,
  };
}

export async function saveHomeTeamName(name: string): Promise<void> {
  await Storage.setItemAsync(HOME_TEAM_KEY, name);
}

export async function saveVisitingTeamName(name: string): Promise<void> {
  await Storage.setItemAsync(VISITING_TEAM_KEY, name);
}
