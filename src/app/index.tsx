import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { File, Paths } from "expo-file-system";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { Message } from "../../types/message";

const STORAGE_KEY = "daust-messenger-messages";

const START_MESSAGES: Message[] = [
  { id: "1", kind: "text", text: "Hi!", mine: false },
  { id: "2", kind: "text", text: "Hello Awa 👋", mine: true },
  { id: "3", kind: "text", text: "Ready for the lab?", mine: false },
];

function Bubble({ message }: { message: Message }) {
  return (
    <Pressable
      disabled={message.kind !== "location"}
      onPress={() => {
        if (message.kind === "location") {
          const url = `https://www.google.com/maps/search/?api=1&query=${message.latitude},${message.longitude}`;
          Linking.openURL(url);
        }
      }}
      style={[
        styles.bubble,
        message.mine && styles.bubbleMine,
        message.kind === "photo" && styles.photoBubble,
      ]}
    >
      {message.kind === "text" && (
        <Text style={message.mine ? styles.textMine : undefined}>{message.text}</Text>
      )}
      {message.kind === "photo" && (
        <Image source={{ uri: message.uri }} style={styles.sentPhoto} contentFit="cover" />
      )}
      {message.kind === "location" && (
        <Text style={message.mine ? styles.textMine : undefined}>
          📍 Location{message.approximate ? " (approximate)" : ""}
        </Text>
      )}
    </Pressable>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(START_MESSAGES);
  const [draft, setDraft] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [settingsAvailable, setSettingsAvailable] = useState(false);
  const [locating, setLocating] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved) {
        try {
          setMessages(JSON.parse(saved) as Message[]);
        } catch {
          setMessages(START_MESSAGES);
        }
      }
      loaded.current = true;
    });
  }, []);

  useEffect(() => {
    if (loaded.current) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  async function haptic() {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  function send() {
    if (draft.trim() === "") return;
    const next: Message = {
      id: String(Date.now()),
      kind: "text",
      text: draft.trim(),
      mine: true,
    };
    setMessages((current) => [...current, next]);
    setDraft("");
    haptic();
  }

  async function pickPhoto() {
    setNotice(null);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  async function takePhoto() {
    setNotice(null);
    setSettingsAvailable(false);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setSettingsAvailable(!permission.canAskAgain);
      setNotice(
        permission.canAskAgain
          ? "DAUST Messenger needs camera access to take a photo. Please allow it and try again."
          : "Camera access is off. Open Settings and allow camera access to take photos."
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  async function keepPhoto(tempUri: string): Promise<string> {
    const source = new File(tempUri);
    const extension = source.extension || ".jpg";
    const destination = new File(Paths.document, `daust-photo-${Date.now()}${extension}`);
    await source.copy(destination);
    return destination.uri;
  }

  async function sendPhoto() {
    if (!photoUri) return;
    try {
      const uri = await keepPhoto(photoUri);
      const next: Message = {
        id: String(Date.now()),
        kind: "photo",
        uri,
        mine: true,
      };
      setMessages((current) => [...current, next]);
      setPhotoUri(null);
      haptic();
    } catch {
      setNotice("Could not save the photo. Please try again.");
    }
  }

  async function shareLocation() {
    setNotice(null);
    setSettingsAvailable(false);
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted) {
      setSettingsAvailable(!permission.canAskAgain);
      setNotice(
        permission.canAskAgain
          ? "DAUST Messenger needs your position to share it. Please allow location access and try again."
          : "Location access is off. Open Settings and allow location access to share your position."
      );
      return;
    }

    setLocating(true);
    try {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const approximate =
        permission.android?.accuracy === "coarse" ||
        permission.ios?.scope === "whenInUse" && permission.ios?.accuracy === "reduced";
      const next: Message = {
        id: String(Date.now()),
        kind: "location",
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        approximate,
        mine: true,
      };
      setMessages((current) => [...current, next]);
      haptic();
    } catch {
      setNotice("Could not find your position. Turn on location services and try again.");
    } finally {
      setLocating(false);
    }
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

      <ScrollView
        style={styles.messages}
        contentContainerStyle={{ paddingVertical: 8 }}
      >
        {messages.map((m) => (
          <Bubble key={m.id} message={m} />
        ))}
      </ScrollView>

      {photoUri && (
        <View style={styles.previewArea}>
          <Image source={{ uri: photoUri }} style={styles.preview} contentFit="cover" />
          <Pressable onPress={() => setPhotoUri(null)}>
            <Text style={styles.remove}>Remove</Text>
          </Pressable>
        </View>
      )}

      {notice && (
        <View style={styles.noticeArea}>
          <Text style={styles.notice}>{notice}</Text>
          {settingsAvailable && (
            <Pressable onPress={() => Linking.openSettings()}>
              <Text style={styles.settingsLink}>Open Settings</Text>
            </Pressable>
          )}
        </View>
      )}

      <View style={styles.footer}>
        <Pressable style={styles.tool} onPress={pickPhoto}>
          <Text style={styles.toolLabel}>📎</Text>
        </Pressable>
        <Pressable style={styles.tool} onPress={takePhoto}>
          <Text style={styles.toolLabel}>📷</Text>
        </Pressable>
        <Pressable
          style={[styles.tool, locating && styles.disabled]}
          onPress={shareLocation}
          disabled={locating}
        >
          {locating ? (
            <ActivityIndicator size="small" color="#1a5276" />
          ) : (
            <Text style={styles.toolLabel}>📍</Text>
          )}
        </Pressable>
        <TextInput
          style={styles.input}
          placeholder="Write a message…"
          value={draft}
          onChangeText={setDraft}
        />

        <Pressable style={styles.send} onPress={photoUri ? sendPhoto : send}>
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
  photoBubble: {
    padding: 4,
  },
  sentPhoto: {
    width: 220,
    height: 220,
  },
  previewArea: {
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  preview: {
    width: 180,
    height: 180,
  },
  remove: {
    color: "#b91c1c",
    marginTop: 6,
  },
  noticeArea: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fee2e2",
  },
  notice: {
    color: "#7f1d1d",
  },
  settingsLink: {
    color: "#1d4ed8",
    fontWeight: "bold",
    marginTop: 6,
  },
  tool: {
    width: 36,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  toolLabel: {
    fontSize: 18,
  },
  disabled: {
    opacity: 0.5,
  },

});