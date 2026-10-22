import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen
          name="new-message"
          options={{
            presentation: "modal",
            title: "New Message",
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}