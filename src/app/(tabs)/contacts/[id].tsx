import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { CONTACTS } from "@/data/contacts";

export default function ContactDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const router = useRouter();

  const contact = CONTACTS.find((contact) => contact.id === id);

  if (!contact) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Contact not found.</Text>

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Stack.Screen
        options={{
          title: contact.name,
        }}
      />

      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {contact.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <Text style={styles.name}>{contact.name}</Text>

      <Text style={styles.program}>{contact.program}</Text>

      <Pressable
        style={styles.messageButton}
        onPress={() =>
          router.push({
            pathname: "/contacts/chat",
            params: {
              id: contact.id,
              name: contact.name,
            },
          })
        }
      >
        <Text style={styles.messageButtonText}>Send a message</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#25D366",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 20,
  },

  avatarText: {
    color: "white",
    fontSize: 40,
    fontWeight: "700",
  },

  name: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 8,
  },

  program: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },

  messageButton: {
    backgroundColor: "#25D366",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },

  messageButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  notFound: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },

  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#25D366",
  },

  backButtonText: {
    color: "#25D366",
    fontWeight: "600",
  },
});