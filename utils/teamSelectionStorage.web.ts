const HOME_TEAM_KEY = 'selectedHomeTeamName';
const VISITING_TEAM_KEY = 'selectedVisitingTeamName';

export async function loadSelectedTeams(): Promise<{
  homeTeamName?: string;
  visitingTeamName?: string;
}> {
  return {
    homeTeamName: window.localStorage.getItem(HOME_TEAM_KEY) ?? undefined,
    visitingTeamName: window.localStorage.getItem(VISITING_TEAM_KEY) ?? undefined,
  };
}

export async function saveHomeTeamName(name: string): Promise<void> {
  window.localStorage.setItem(HOME_TEAM_KEY, name);
}

export async function saveVisitingTeamName(name: string): Promise<void> {
  window.localStorage.setItem(VISITING_TEAM_KEY, name);
}
