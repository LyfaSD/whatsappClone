import { Tabs } from "expo-router";
import { DrawerToggleButton } from "expo-router/drawer";
import { FavouritesProvider } from "@/context/FavouritesContext";

export default function TabsLayout() {
  return (
    <FavouritesProvider>
      <Tabs screenOptions={{ headerLeft: () => <DrawerToggleButton /> }}>
        <Tabs.Screen
          name="index"
          options={{ title: "Home" }}
        />

        <Tabs.Screen
          name="contacts"
          options={{ title: "Contacts", headerShown: false }}
        />

        <Tabs.Screen
          name="favourites"
          options={{ title: "Favourites" }}
        />
      </Tabs>
    </FavouritesProvider>
  );
}