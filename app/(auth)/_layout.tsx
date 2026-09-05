import { Stack } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { Redirect } from 'expo-router';

export default function AuthLayout() {
  const { token } = useAuthStore();

  // If already authenticated, redirect to main app
  if (token) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
