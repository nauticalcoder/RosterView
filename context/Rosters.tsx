import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { TeamRoster } from '@/models/Roster';
import { findNcaaFootballTeam } from '@/constants/ncaaFootballTeams';
import { fetchEspnRoster } from '@/services/espnRoster';
import { loadTeamRoster, saveTeamRoster } from '@/utils/rosterStorage';
import { useSelectedTeams } from '@/context/SelectedTeams';

type RostersContextValue = {
  rosters: Record<string, TeamRoster>;
  isRefreshing: boolean;
  getRoster: (teamName: string | undefined) => TeamRoster | undefined;
  refreshSelectedRosters: () => Promise<void>;
};

const RostersContext = createContext<RostersContextValue | null>(null);

export function RostersProvider({ children }: { children: ReactNode }) {
  const { homeTeamName, visitingTeamName } = useSelectedTeams();
  const [rosters, setRosters] = useState<Record<string, TeamRoster>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const names = [homeTeamName, visitingTeamName].filter((name): name is string => Boolean(name));

    Promise.all(names.map(async (name) => [name, await loadTeamRoster(name)] as const))
      .then((entries) => {
        if (cancelled) {
          return;
        }
        setRosters((current) => {
          const next = { ...current };
          for (const [name, roster] of entries) {
            if (roster) {
              next[name] = roster;
            }
          }
          return next;
        });
      })
      .catch((error) => {
        console.warn('Failed to load saved rosters', error);
      });

    return () => {
      cancelled = true;
    };
  }, [homeTeamName, visitingTeamName]);

  const refreshSelectedRosters = useCallback(async () => {
    if (!homeTeamName || !visitingTeamName) {
      throw new Error('Select a home team and visiting team first');
    }
    const names = [homeTeamName, visitingTeamName];

    setIsRefreshing(true);
    try {
      const refreshed = await Promise.all(
        names.map(async (name) => {
          const team = findNcaaFootballTeam(name);
          if (!team) {
            throw new Error(`No ESPN id found for ${name}`);
          }
          const roster = await fetchEspnRoster(team.name, team.espnId);
          await saveTeamRoster(roster);
          return roster;
        }),
      );

      setRosters((current) => {
        const next = { ...current };
        for (const roster of refreshed) {
          next[roster.teamName] = roster;
        }
        return next;
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [homeTeamName, visitingTeamName]);

  const getRoster = useCallback(
    (teamName: string | undefined) => (teamName ? rosters[teamName] : undefined),
    [rosters],
  );

  const value = useMemo(
    () => ({
      rosters,
      isRefreshing,
      getRoster,
      refreshSelectedRosters,
    }),
    [rosters, isRefreshing, getRoster, refreshSelectedRosters],
  );

  return <RostersContext.Provider value={value}>{children}</RostersContext.Provider>;
}

export function useRosters() {
  const context = useContext(RostersContext);
  if (!context) {
    throw new Error('useRosters must be used within RostersProvider');
  }
  return context;
}
