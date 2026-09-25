import { Image } from "expo-image";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { CONTACTS } from "./data/contacts"; // Adjust the path if needed

// 1. THIS IS YOUR ACTIVE SCREEN NOW
export default function Contacts() {
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      CONTACTS.filter((c) =>
        c.name.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [query]
  );
  
  return (
    <View style={styles.screen}>
      <FlatList
        data={filtered}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => (
          <ContactRow
            contact={item}
            selected={item.id === selectedId}
            onPress={() => setSelectedId(item.id)}
          />
        )}
        ListHeaderComponent={
          <View>
            <View style={styles.headerRow}>
              <Text style={styles.h1}>Contacts</Text>
              <Text style={styles.count}>({filtered.length})</Text>
            </View>
            <TextInput
              style={styles.search}
              placeholder="Search…"
              value={query}
              onChangeText={setQuery}
            />
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <Text style={styles.empty}>No contact matches "{query}".</Text>
        }
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const START_MESSAGES = Array.from({ length: 300 }, (_, i) => ({
  id: String(i),
  text: `Message number ${i + 1}`,
  mine: i % 3 === 0,
}));

function Bubble({ text, mine }: { text: string; mine?: boolean }) {
  return (
    <View style={[styles.bubble, mine && styles.bubbleMine]}>
      <Text style={mine && styles.textMine}>{text}</Text>
    </View>
  );
}

function ContactRow({ contact, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, selected && styles.rowSelected]}
    >
      <Image
        source={`https://i.pravatar.cc/100?u=${contact.id}`}
        style={styles.avatar}
      />
      <View style={styles.rowText}>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.program}>{contact.program}</Text>
      </View>
    </Pressable>
  );
}

// 2. REMOVED "export default" FROM HERE
function Chat() {
  const [messages, setMessages] = useState(START_MESSAGES);
  const [draft, setDraft] = useState("");

  function send() {
    if (draft.trim() === "") return;
    const next = {
      id: String(Date.now()),
      text: draft.trim(),
      mine: true,
    };
    setMessages([...messages, next]);
    setDraft("");
  }
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Image
          source="https://i.pravatar.cc/100"
          style={styles.avatar}
        />
        <Text style={styles.name}>Awa Diop</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <Bubble text={item.text} mine={item.mine} />
        )}
        style={styles.messages}
        contentContainerStyle={{ paddingVertical: 8 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No messages yet. Say hello.</Text>
        }
        ListHeaderComponent={
          <Text style={styles.dateLabel}>Today</Text>
        }
      />

      <View style={styles.footer}>
        <TextInput
          style={styles.input}
          placeholder="Write a message…"
          value={draft}
          onChangeText={setDraft}
        />
        <Pressable style={styles.send} onPress={send}>
          <Text style={styles.sendLabel}>➤</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },

  header: {
    height: 60,
    backgroundColor: "#dbeafe",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 10,
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  name: { fontSize: 17, fontWeight: "bold" },
  messages: { flex: 1, backgroundColor: "#f4f4f4" },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 40,
  },
  send: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a5276",
    justifyContent: "center",
    alignItems: "center",
  },
  sendLabel: { color: "#fff", fontSize: 16 },

  bubble: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 14,
    maxWidth: "75%",
    margin: 8,
  },
  bubbleMine: {
    backgroundColor: "#1a5276",
    alignSelf: "flex-end",
  },
  textMine: { color: "#fff" },
  empty: {
    textAlign: "center",
    color: "#888",
    paddingVertical: 32,
  },
  dateLabel: {
    textAlign: "center",
    color: "#888",
    fontSize: 12,
    paddingBottom: 8,
  },
  row:     { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 },
  rowText: { flex: 1 },
  program: { fontSize: 13, color: "#666" },

  headerRow: { 
    flexDirection: "row", 
    justifyContent: "space-between",
    alignItems: "center", 
    paddingBottom: 8 
  },
  h1:        { fontSize: 22, fontWeight: "bold", color: "#1a5276" },
  count:     { color: "#888" },
  separator: { height: 1, backgroundColor: "#e5e5e5" },
  empty:     { textAlign: "center", color: "#888", paddingVertical: 32 },

  search: { 
    height: 40, borderWidth: 1, borderColor: "#ccc", borderRadius: 20,
    paddingHorizontal: 14, marginBottom: 12 
  },

  rowSelected: { backgroundColor: "#dbeafe", borderRadius: 8, paddingHorizontal: 8 },
});