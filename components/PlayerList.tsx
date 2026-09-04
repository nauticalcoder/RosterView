import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { FlatList, Text, View } from '@/components/Themed';
import { Player } from '@/models/Player';
import { TeamRoster } from '@/models/Roster';

type PlayerListProps = {
  teamName?: string;
  roster?: TeamRoster;
};

type SortKey = 'jersey' | 'position' | 'name' | 'height' | 'weight' | 'class' | 'birthplace';

const COLUMN_WIDTHS: Record<SortKey, number> = {
  jersey: 48,
  position: 52,
  name: 180,
  height: 64,
  weight: 88,
  class: 64,
  birthplace: 200,
};

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'jersey', label: 'No.' },
  { key: 'position', label: 'Pos' },
  { key: 'name', label: 'Name' },
  { key: 'height', label: 'Ht' },
  { key: 'weight', label: 'Wt' },
  { key: 'class', label: 'Class' },
  { key: 'birthplace', label: 'Birthplace' },
];

const TABLE_WIDTH = Object.values(COLUMN_WIDTHS).reduce((sum, width) => sum + width, 30);

const CLASS_RANK: Record<string, number> = {
  FR: 1,
  'RS FR': 2,
  SO: 3,
  'RS SO': 4,
  JR: 5,
  'RS JR': 6,
  SR: 7,
  'RS SR': 8,
  Freshman: 1,
  Sophomore: 3,
  Junior: 5,
  Senior: 7,
};

function formatUpdatedAt(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleString();
}

function parseNumber(value: string): number {
  const parsed = parseInt(value.replace(/[^\d-]/g, ''), 10);
  return Number.isFinite(parsed) ? parsed : Number.POSITIVE_INFINITY;
}

function parseHeightInches(value: string): number {
  const match = value.match(/(\d+)\s*'\s*(\d+)/);
  if (!match) {
    return Number.POSITIVE_INFINITY;
  }
  return Number(match[1]) * 12 + Number(match[2]);
}

function comparePlayers(a: Player, b: Player, key: SortKey, direction: 1 | -1): number {
  let result = 0;
  switch (key) {
    case 'jersey':
      result = parseNumber(a.jersey) - parseNumber(b.jersey);
      break;
    case 'height':
      result = parseHeightInches(a.height) - parseHeightInches(b.height);
      break;
    case 'weight':
      result = parseNumber(a.weight) - parseNumber(b.weight);
      break;
    case 'class':
      result = (CLASS_RANK[a.class] ?? 99) - (CLASS_RANK[b.class] ?? 99);
      break;
    default:
      result = (a[key] || '').localeCompare(b[key] || '', undefined, { sensitivity: 'base' });
  }
  if (result === 0) {
    result = a.name.localeCompare(b.name);
  }
  return result * direction;
}

function Cell({
  value,
  width,
  bold = false,
}: {
  value: string;
  width: number;
  bold?: boolean;
}) {
  return (
    <Text numberOfLines={1} style={[styles.cell, { width }, bold && styles.cellBold]}>
      {value || '--'}
    </Text>
  );
}

function HeaderCell({
  label,
  width,
  active,
  direction,
  onPress,
}: {
  label: string;
  width: number;
  active: boolean;
  direction: 1 | -1;
  onPress: () => void;
}) {
  const marker = active ? (direction === 1 ? ' ▲' : ' ▼') : '';
  return (
    <Pressable onPress={onPress} style={{ width }} accessibilityRole="button">
      <Text numberOfLines={1} style={[styles.cell, styles.cellBold, active && styles.activeHeader]}>
        {label}
        {marker}
      </Text>
    </Pressable>
  );
}

function RosterRow({ player }: { player: Player }) {
  return (
    <View style={styles.row}>
      <Cell value={player.jersey} width={COLUMN_WIDTHS.jersey} />
      <Cell value={player.position} width={COLUMN_WIDTHS.position} />
      <Cell value={player.name} width={COLUMN_WIDTHS.name} bold />
      <Cell value={player.height} width={COLUMN_WIDTHS.height} />
      <Cell value={player.weight} width={COLUMN_WIDTHS.weight} />
      <Cell value={player.class} width={COLUMN_WIDTHS.class} />
      <Cell value={player.birthplace} width={COLUMN_WIDTHS.birthplace} />
    </View>
  );
}

export default function PlayerList({ teamName, roster }: PlayerListProps) {
  const [sortKey, setSortKey] = useState<SortKey>('jersey');
  const [sortDirection, setSortDirection] = useState<1 | -1>(1);

  const players = useMemo(() => {
    if (!roster) {
      return [];
    }
    return [...roster.players].sort((a, b) => comparePlayers(a, b, sortKey, sortDirection));
  }, [roster, sortKey, sortDirection]);

  const onSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((current) => (current === 1 ? -1 : 1));
      return;
    }
    setSortKey(key);
    setSortDirection(1);
  };

  if (!teamName) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Select a team in Settings</Text>
      </View>
    );
  }

  if (!roster || roster.players.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          No roster saved for {teamName}. Open Settings and tap Refresh Rosters.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.updated}>Updated {formatUpdatedAt(roster.updatedAt)}</Text>
      <ScrollView
        horizontal
        style={styles.horizontalScroll}
        contentContainerStyle={styles.horizontalContent}
        showsHorizontalScrollIndicator
      >
        <View style={styles.table}>
          <FlatList
            data={players}
            keyExtractor={(item: Player) => item.id}
            renderItem={({ item }: { item: Player }) => <RosterRow player={item} />}
            ListHeaderComponent={
              <View style={[styles.row, styles.headerRow]}>
                {COLUMNS.map((column) => (
                  <HeaderCell
                    key={column.key}
                    label={column.label}
                    width={COLUMN_WIDTHS[column.key]}
                    active={sortKey === column.key}
                    direction={sortDirection}
                    onPress={() => onSort(column.key)}
                  />
                ))}
              </View>
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  updated: {
    fontSize: 12,
    opacity: 0.8,
    paddingHorizontal: 15,
    paddingTop: 8,
    paddingBottom: 6,
  },
  horizontalScroll: {
    flex: 1,
  },
  horizontalContent: {
    flexGrow: 1,
  },
  table: {
    width: TABLE_WIDTH,
    flex: 1,
    paddingLeft: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 36,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  headerRow: {
    paddingBottom: 4,
  },
  cell: {
    fontSize: 12,
    paddingRight: 12,
  },
  cellBold: {
    fontWeight: 'bold',
  },
  activeHeader: {
    textDecorationLine: 'underline',
  },
});
