import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { Brand } from '@/constants/theme';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Brand.surfaceLight },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="register" />
          <Stack.Screen name="entertainer" />
          <Stack.Screen name="guest/index" />
          <Stack.Screen name="guest/activities" />
          <Stack.Screen name="guest/dining" />
          <Stack.Screen name="guest/map" />
          <Stack.Screen name="guest/room" />
        </Stack>
      </AuthProvider>
    </LanguageProvider>
  );
}
