import { StyleSheet, Text, View } from "react-native";

type Contact = {
  id: string;
  name: string;
  program: string;
};

export function ContactRow({ contact }: { contact: Contact }) {
  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {contact.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.program}>{contact.program}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#25D366",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  avatarText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 17,
    fontWeight: "600",
  },

  program: {
    fontSize: 14,
    color: "#777",
    marginTop: 3,
  },
});