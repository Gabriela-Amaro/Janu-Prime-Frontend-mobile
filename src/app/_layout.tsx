// /src/app/_layout.tsx
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Impede que a splash feche automaticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Carregamento das fontes
  const [loaded] = useFonts({
    'AppRegular': require('../../assets/fonts/roboto/Roboto-Regular.ttf'),
    'AppMedium': require('../../assets/fonts/roboto/Roboto-Medium.ttf'),
    'AppBold': require('../../assets/fonts/roboto/Roboto-Bold.ttf'),
  });

  // Esconde a splash quando as fontes carregam
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Não renderiza nada enquanto carrega
  if (!loaded) {
    return null;
  }

  // Renderização principal
  return (
    <SafeAreaProvider>
      {/* Navegação raiz */}
      <Stack screenOptions={{ headerShown: false }}>
        {/* Grupo de autenticação */}
        <Stack.Screen name="(auth)" />
        
        {/* Grupo das tabs (rota principal após login) */}
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}