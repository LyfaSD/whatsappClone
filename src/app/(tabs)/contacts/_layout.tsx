import { Stack } from "expo-router";

export const unstable_settings = { initialRouteName: "index" };

export default function ContactsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Contacts",
        }}
      />

      <Stack.Screen
        name="[id]"
        options={{
          title: "Contact",
        }}
      />

      <Stack.Screen
        name="chat"
        options={{
          title: "Chat",
        }}
      />
    </Stack>
  );
}