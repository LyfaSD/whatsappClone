import { Image } from "expo-image";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";





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

export default function Chat() {
  const [messages, setMessages] = useState(START_MESSAGES);
  const [draft, setDraft] = useState("");

  function send() {
    if (draft.trim() === "") return;             // ignore empty sends
    const next = {
      id: String(Date.now()),                    // a good-enough unique id
      text: draft.trim(),
      mine: true,
    };
    setMessages([...messages, next]);            // new array — never push
    setDraft("");                                // clear the input
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

      {/* 
      <View style={styles.messages}>
        <Bubble text="Hi!" />
        <Bubble text="Hello Awa 👋" mine />
        <Bubble text="Ready for the lab?" />
      </View> */}
      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <Bubble text={item.text} mine={item.mine} />
        )}
        style={styles.messages}
        contentContainerStyle={{ paddingVertical: 8 }}
        ListEmptyComponent={
          <Text style={styles.empty}>
          No messages yet. Say hello.
          </Text>
        }
        ListHeaderComponent={
          <Text style={styles.dateLabel}>
          Today
          </Text>
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
    flexDirection: "row",       // side by side
    alignItems: "center",       // centred on the cross axis (vertical, in a row)
    paddingHorizontal: 12,
    gap: 10,                    // space between photo and name
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
    flex: 1,                    // take all width the button leaves
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
    maxWidth: "75%",            // bubbles never span the full width
    margin: 8,
  },
  bubbleMine: {
    backgroundColor: "#1a5276",
    alignSelf: "flex-end",      // this bubble moves to the right
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

});