import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RootSiblingParent } from 'react-native-root-siblings';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import {
  configureNotificationHandler,
  observeNotificationResponses,
  restoreFridayReminderIfEnabled,
} from '@/services/fridayReminder';
import { configureHttp } from '../utils';
import { apiBaseUrl } from '@/constants/ApiConfig';
import { SelectedTeamsProvider } from '@/context/SelectedTeams';
import { RostersProvider } from '@/context/Rosters';

configureHttp(apiBaseUrl);
configureNotificationHandler();

const queryClient = new QueryClient();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    const stopObserving = observeNotificationResponses();
    restoreFridayReminderIfEnabled().catch((error) => {
      console.warn('Failed to restore Friday reminder', error);
    });
    return stopObserving;
  }, []);

  return (
    <RootSiblingParent>
      <QueryClientProvider client={queryClient}>
        <SelectedTeamsProvider>
          <RostersProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: true, title: "Roster View" }} />
              </Stack>
            </ThemeProvider>
          </RostersProvider>
        </SelectedTeamsProvider>
      </QueryClientProvider>
    </RootSiblingParent>
  );
}
