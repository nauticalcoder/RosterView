import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

import Colors from '@/constants/Colors';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: string;
}) {
  return <MaterialCommunityIcons size={28} style={{ marginBottom: -3 }} {...props} />;
}

function SettingsButton(props: {
}) {
  return <MaterialCommunityIcons size={28} style={{ marginBottom: -3 }} {...props} name="settings-helper" />
}


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Penn State',
          tabBarIcon: ({ color }) => <TabBarIcon name="alpha-h-box" color={color} />,
          headerRight: () => (<SettingsButton />)
        }}
      />
      <Tabs.Screen
        name="visitingTeam"
        options={{
          title: 'West Virginia',
          tabBarIcon: ({ color }) => <TabBarIcon name="alpha-v-box-outline" color={color} />,
          headerRight: () => (<SettingsButton />)
        }}
      />
    </Tabs>
  );
}
