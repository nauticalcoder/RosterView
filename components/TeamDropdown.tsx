import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View, useThemeColor } from '@/components/Themed';
import { NcaaFootballTeam } from '@/constants/ncaaFootballTeams';

type TeamDropdownProps = {
  label: string;
  teams: NcaaFootballTeam[];
  selectedName: string | undefined;
  onSelect: (name: string) => void;
  placeholder?: string;
};

export default function TeamDropdown({
  label,
  teams,
  selectedName,
  onSelect,
  placeholder = 'Select a team',
}: TeamDropdownProps) {
  const [open, setOpen] = useState(false);
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const selected = teams.find((team) => team.name === selectedName);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.trigger,
          { borderColor: textColor, opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Text style={styles.triggerLabel} numberOfLines={1}>
          {selected?.name ?? placeholder}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={22} color={textColor} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.modalRoot}>
          <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
          <View style={[styles.menu, { backgroundColor, borderColor: textColor }]}>
            <Text style={styles.menuTitle}>{label}</Text>
            <FlatList
              data={teams}
              keyExtractor={(item) => item.name}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text style={styles.empty}>No teams available</Text>
              }
              renderItem={({ item }) => {
                const isSelected = item.name === selectedName;
                return (
                  <Pressable
                    onPress={() => {
                      onSelect(item.name);
                      setOpen(false);
                    }}
                    style={({ pressed }) => [
                      styles.option,
                      isSelected && styles.optionSelected,
                      pressed && styles.optionPressed,
                    ]}
                  >
                    <View style={styles.optionText}>
                      <Text style={styles.optionLabel}>{item.name}</Text>
                      <Text style={styles.optionConference}>{item.conference}</Text>
                    </View>
                    {isSelected ? (
                      <MaterialCommunityIcons name="check" size={20} color={textColor} />
                    ) : null}
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  trigger: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerLabel: {
    flex: 1,
    fontSize: 16,
    marginRight: 8,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  menu: {
    maxHeight: '70%',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  option: {
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionSelected: {
    opacity: 0.85,
  },
  optionPressed: {
    opacity: 0.7,
  },
  optionText: {
    flex: 1,
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  optionLabel: {
    fontSize: 16,
  },
  optionConference: {
    fontSize: 13,
    opacity: 0.75,
    marginTop: 2,
  },
  empty: {
    padding: 16,
    fontSize: 16,
  },
});
