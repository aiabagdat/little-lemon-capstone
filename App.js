import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import OnboardingScreen from './screens/Onboarding';
import HomeScreen from './screens/Home';
import ProfileScreen from './screens/Profile';
import Logo from './components/Logo';
import Avatar from './components/Avatar';
import { AuthContext } from './AuthContext';
import { colors, PROFILE_KEY } from './theme';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // Read the saved profile once, when the app starts
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(PROFILE_KEY);
        if (saved) setProfile(JSON.parse(saved));
      } catch (e) {
        console.warn('Could not read profile', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const saveProfile = useCallback(async (data) => {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(data));
    setProfile(data);
  }, []);

  const logOut = useCallback(async () => {
    await AsyncStorage.clear();
    setProfile(null);
  }, []);

  const auth = useMemo(() => ({ profile, saveProfile, logOut }), [profile, saveProfile, logOut]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }

  const isOnboardingCompleted = Boolean(profile?.onboardingCompleted);

  return (
    <SafeAreaProvider>
      <AuthContext.Provider value={auth}>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Stack.Navigator
            screenOptions={{
              headerTitleAlign: 'center',
              headerTitle: () => <Logo />,
              headerTintColor: colors.green,
              headerBackButtonDisplayMode: 'minimal',
            }}
          >
            {isOnboardingCompleted ? (
              <>
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={({ navigation }) => ({
                    headerRight: () => (
                      <Pressable
                        onPress={() => navigation.navigate('Profile')}
                        accessibilityRole="button"
                        accessibilityLabel="Open profile"
                      >
                        <Avatar firstName={profile.firstName} lastName={profile.lastName} size={36} />
                      </Pressable>
                    ),
                  })}
                />
                <Stack.Screen name="Profile" component={ProfileScreen} />
              </>
            ) : (
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
}
