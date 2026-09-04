import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ncaaFootballTeams } from '@/constants/ncaaFootballTeams';
import {
  loadSelectedTeams,
  saveHomeTeamName,
  saveVisitingTeamName,
} from '@/utils/teamSelectionStorage';

type SelectedTeamsContextValue = {
  homeTeamName?: string;
  visitingTeamName?: string;
  setHomeTeamName: (name: string) => void;
  setVisitingTeamName: (name: string) => void;
};

const SelectedTeamsContext = createContext<SelectedTeamsContextValue | null>(null);

function knownTeamName(name: string | undefined): string | undefined {
  if (!name) {
    return undefined;
  }
  return ncaaFootballTeams.some((team) => team.name === name) ? name : undefined;
}

export function SelectedTeamsProvider({ children }: { children: ReactNode }) {
  const [homeTeamName, setHomeTeamNameState] = useState<string | undefined>();
  const [visitingTeamName, setVisitingTeamNameState] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;

    loadSelectedTeams()
      .then((saved) => {
        if (cancelled) {
          return;
        }
        setHomeTeamNameState(knownTeamName(saved.homeTeamName));
        setVisitingTeamNameState(knownTeamName(saved.visitingTeamName));
      })
      .catch((error) => {
        console.warn('Failed to load saved team selections', error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const setHomeTeamName = useCallback((name: string) => {
    setHomeTeamNameState(name);
    saveHomeTeamName(name).catch((error) => {
      console.warn('Failed to save home team selection', error);
    });
  }, []);

  const setVisitingTeamName = useCallback((name: string) => {
    setVisitingTeamNameState(name);
    saveVisitingTeamName(name).catch((error) => {
      console.warn('Failed to save visiting team selection', error);
    });
  }, []);

  const value = useMemo(
    () => ({
      homeTeamName,
      visitingTeamName,
      setHomeTeamName,
      setVisitingTeamName,
    }),
    [homeTeamName, visitingTeamName, setHomeTeamName, setVisitingTeamName],
  );

  return (
    <SelectedTeamsContext.Provider value={value}>
      {children}
    </SelectedTeamsContext.Provider>
  );
}

export function useSelectedTeams() {
  const context = useContext(SelectedTeamsContext);
  if (!context) {
    throw new Error('useSelectedTeams must be used within SelectedTeamsProvider');
  }
  return context;
}
