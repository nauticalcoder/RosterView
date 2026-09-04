import ncaaFootballTeamsJson from '@/assets/ncaa-football-teams.json';

export type NcaaFootballTeam = {
  name: string;
  conference: string;
  espnId: number;
};

export const ncaaFootballTeams: NcaaFootballTeam[] = [...ncaaFootballTeamsJson].sort((a, b) =>
  a.name.localeCompare(b.name)
);

export function findNcaaFootballTeam(name: string | undefined): NcaaFootballTeam | undefined {
  if (!name) {
    return undefined;
  }
  return ncaaFootballTeams.find((team) => team.name === name);
}
