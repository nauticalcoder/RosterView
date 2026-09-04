import { TeamRoster } from '@/models/Roster';

function rosterKey(teamName: string) {
  return `roster:${teamName}`;
}

export async function saveTeamRoster(roster: TeamRoster): Promise<void> {
  window.localStorage.setItem(rosterKey(roster.teamName), JSON.stringify(roster));
}

export async function loadTeamRoster(teamName: string): Promise<TeamRoster | undefined> {
  const raw = window.localStorage.getItem(rosterKey(teamName));
  if (!raw) {
    return undefined;
  }
  try {
    return JSON.parse(raw) as TeamRoster;
  } catch {
    return undefined;
  }
}
