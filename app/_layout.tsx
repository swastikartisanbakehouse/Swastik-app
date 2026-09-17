import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '../src/store/authStore';
import { authApi } from '../src/api/auth';
import { TOKEN_KEY } from '../src/api/client';
import { Colors } from '../src/theme';

// Prevent auto-hiding splash screen
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function RootLayoutNav() {
  const { setAuth, clearAuth, setHydrated, isHydrated } = useAuthStore();

  useEffect(() => {
    async function bootstrap() {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
          // Validate token by fetching current user
          const user = await authApi.getCurrentUser();
          await setAuth(token, user);
        }
      } catch {
        // Token invalid or expired — clear it
        await clearAuth();
      } finally {
        setHydrated();
        await SplashScreen.hideAsync();
      }
    }
    bootstrap();
  }, []);

  if (!isHydrated) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="category/[id]"
        options={{
          headerShown: true,
          headerBackTitle: '',
          headerTintColor: Colors.maroon,
          headerStyle: { backgroundColor: Colors.white },
          headerShadowVisible: false,
          title: '',
        }}
      />
      <Stack.Screen
        name="product/[id]"
        options={{
          headerShown: true,
          headerBackTitle: '',
          headerTintColor: Colors.maroon,
          headerStyle: { backgroundColor: Colors.white },
          headerShadowVisible: false,
          title: '',
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <RootLayoutNav />
    </QueryClientProvider>
  );
}
