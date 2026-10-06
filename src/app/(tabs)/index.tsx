import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>WhatsApp Clone</Text>

      <Text style={styles.subtitle}>
        Welcome to your messaging application.
      </Text>

      <Link href="/contacts" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>View Contacts</Text>
        </Pressable>
      </Link>

      <Link href="/new-message" asChild>
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>New Message</Text>
        </Pressable>
      </Link>
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
    marginBottom: 12,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: "#25D366",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },

  secondaryButtonText: {
    color: "#25D366",
    fontSize: 16,
    fontWeight: "600",
  },
});