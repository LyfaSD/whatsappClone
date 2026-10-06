import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function NewMessage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Message</Text>

      <Text style={styles.subtitle}>
        Choose a contact to start a conversation.
      </Text>

      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Close</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },

  button: {
    backgroundColor: "#25D366",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});