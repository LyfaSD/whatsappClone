import { Link } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { ContactRow } from "@/components/ContactRow";
import { CONTACTS } from "@/data/contacts";
import { useFavourites } from "@/context/FavouritesContext";

export default function Contacts() {
  const { isFavourite } = useFavourites();

  const [query, setQuery] = useState("");

  const filteredContacts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return CONTACTS;
    }

    return CONTACTS.filter(
      (contact) =>
        contact.name.toLowerCase().includes(normalizedQuery) ||
        contact.program.toLowerCase().includes(normalizedQuery)
    );
  }, [query]);

  return (
    <View style={styles.container}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search contacts..."
        style={styles.search}
      />

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: "/contacts/[id]",
              params: { id: item.id },
            }}
            asChild
          >
            <Pressable>
              <ContactRow contact={item} favourite={isFavourite(item.id)} />
            </Pressable>
          </Link>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <Text style={styles.empty}>No contacts found.</Text>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  search: {
    margin: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    fontSize: 16,
  },

  listContent: {
    paddingHorizontal: 16,
  },

  separator: {
    height: 1,
    backgroundColor: "#e5e5e5",
  },

  empty: {
    textAlign: "center",
    color: "#888",
    paddingVertical: 32,
  },
});