import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { ColorValue, useColorScheme } from 'react-native';

import Colors from '@/constants/Colors';
import { useSelectedTeams } from '@/context/SelectedTeams';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: ColorValue;
}) {
  return <MaterialCommunityIcons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const { homeTeamName, visitingTeamName } = useSelectedTeams();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: homeTeamName ?? 'Home Team',
          tabBarIcon: ({ color }) => <TabBarIcon name="alpha-h-box" color={color} />,
        }}
      />
      <Tabs.Screen
        name="visitingTeam"
        options={{
          title: visitingTeamName ?? 'Visiting Team',
          tabBarIcon: ({ color }) => <TabBarIcon name="alpha-v-box-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
