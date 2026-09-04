import { Player } from './Player';

export type TeamRoster = {
  teamName: string;
  espnId: number;
  updatedAt: string;
  players: Player[];
};
