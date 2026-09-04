import { Player } from '@/models/Player';
import { TeamRoster } from '@/models/Roster';

const SAFARI_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

function rosterApiUrl(espnId: number) {
  return `https://site.web.api.espn.com/apis/site/v2/sports/football/college-football/teams/${espnId}/roster`;
}

function rosterPageUrl(espnId: number) {
  return `https://www.espn.com/college-football/team/roster/_/id/${espnId}`;
}

function textValue(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function mapPlayer(raw: Record<string, unknown>): Player | null {
  const id = textValue(raw.id);
  const name = textValue(raw.displayName) || textValue(raw.name) || textValue(raw.fullName);
  if (!id || !name) {
    return null;
  }

  const position = raw.position as Record<string, unknown> | string | undefined;
  const experience = raw.experience as Record<string, unknown> | undefined;
  const birthPlace = raw.birthPlace as Record<string, unknown> | string | undefined;

  const positionText =
    typeof position === 'string'
      ? position
      : textValue(position?.abbreviation) || textValue(position?.displayName);
  const classText =
    textValue(experience?.abbreviation) || textValue(experience?.displayValue) || textValue(raw.experience);
  const birthplaceText =
    typeof birthPlace === 'string' ? birthPlace : textValue(birthPlace?.displayText);

  return {
    id,
    name,
    position: positionText,
    height: textValue(raw.displayHeight) || textValue(raw.height),
    weight: textValue(raw.displayWeight) || textValue(raw.weight),
    class: classText,
    birthplace: birthplaceText,
    jersey: textValue(raw.jersey),
  };
}

function playersFromApiPayload(payload: unknown): Player[] {
  const athletes = (payload as { athletes?: Array<{ items?: unknown[] }> })?.athletes;
  if (!Array.isArray(athletes)) {
    return [];
  }

  const players: Player[] = [];
  const seen = new Set<string>();
  for (const group of athletes) {
    for (const item of group.items ?? []) {
      if (!item || typeof item !== 'object') {
        continue;
      }
      const player = mapPlayer(item as Record<string, unknown>);
      if (player && !seen.has(player.id)) {
        seen.add(player.id);
        players.push(player);
      }
    }
  }
  return players;
}

function findRosterGroups(value: unknown): Array<{ athletes?: unknown[] }> | undefined {
  if (!value || typeof value !== 'object') {
    return undefined;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findRosterGroups(item);
      if (found) {
        return found;
      }
    }
    return undefined;
  }

  const record = value as Record<string, unknown>;
  const groups = record.groups;
  if (Array.isArray(groups) && groups[0] && typeof groups[0] === 'object' && 'athletes' in (groups[0] as object)) {
    return groups as Array<{ athletes?: unknown[] }>;
  }
  for (const nested of Object.values(record)) {
    const found = findRosterGroups(nested);
    if (found) {
      return found;
    }
  }
  return undefined;
}

function playersFromHtml(html: string): Player[] {
  const marker = "window['__espnfitt__']=";
  const start = html.indexOf(marker);
  if (start < 0) {
    throw new Error('ESPN roster data was not found on the page');
  }
  const jsonStart = start + marker.length;
  const scriptEnd = html.indexOf('</script>', jsonStart);
  if (scriptEnd < 0) {
    throw new Error('ESPN roster data was incomplete');
  }
  let raw = html.slice(jsonStart, scriptEnd).trim();
  if (raw.endsWith(';')) {
    raw = raw.slice(0, -1);
  }
  const payload = JSON.parse(raw) as unknown;
  const groups = findRosterGroups(payload);
  if (!groups) {
    return [];
  }

  const players: Player[] = [];
  const seen = new Set<string>();
  for (const group of groups) {
    for (const item of group.athletes ?? []) {
      if (!item || typeof item !== 'object') {
        continue;
      }
      const player = mapPlayer(item as Record<string, unknown>);
      if (player && !seen.has(player.id)) {
        seen.add(player.id);
        players.push(player);
      }
    }
  }
  return players;
}

async function fetchWithTimeout(url: string, headers: Record<string, string>): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, {
      headers,
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`ESPN request failed (${response.status})`);
    }
    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

function sortPlayers(players: Player[]): Player[] {
  return [...players].sort((a, b) => {
    const position = a.position.localeCompare(b.position);
    if (position !== 0) {
      return position;
    }
    return a.name.localeCompare(b.name);
  });
}

export async function fetchEspnRoster(teamName: string, espnId: number): Promise<TeamRoster> {
  let players: Player[] = [];

  try {
    const jsonText = await fetchWithTimeout(rosterApiUrl(espnId), {
      Accept: 'application/json',
    });
    players = playersFromApiPayload(JSON.parse(jsonText) as unknown);
  } catch {
    players = [];
  }

  if (players.length === 0) {
    const html = await fetchWithTimeout(rosterPageUrl(espnId), {
      Accept: 'text/html',
      'User-Agent': SAFARI_UA,
    });
    players = playersFromHtml(html);
  }

  if (players.length === 0) {
    throw new Error(`No roster players found for ${teamName}`);
  }

  return {
    teamName,
    espnId,
    updatedAt: new Date().toISOString(),
    players: sortPlayers(players),
  };
}
