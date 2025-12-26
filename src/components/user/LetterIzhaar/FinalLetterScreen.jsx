// Template styles for each templateId
const templateStyles = {
  '1': { backgroundColor: '#fffaf5', borderColor: '#ffb6b9', borderWidth: 3 }, // Romantic Pink
  '2': { backgroundColor: '#fff0f5', borderColor: '#e75480', borderWidth: 3 }, // Rose Love
  '3': { backgroundColor: '#f0fff0', borderColor: '#a3d8f4', borderWidth: 3 }, // Cute Couple
  '4': { backgroundColor: '#f5f5dc', borderColor: '#deb887', borderWidth: 3 }, // Classic Letter
};
import { useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ViewShot from "react-native-view-shot";
import { useLetter } from "../../context/LetterContext";
import { useReceiverForLetter } from "../../context/ReceiverForLetterContext";
import api from "../../utils/api";

/* -------------------- DOWNLOAD HANDLER -------------------- */
const handleDownloadImage = async (viewShotRef) => {
  try {
    const uri = await viewShotRef.current.capture();
    if (!uri) return Alert.alert("Error", "Capture failed");

    if (Platform.OS === "web") {
      const link = document.createElement("a");
      link.href = uri;
      link.download = "letter.png";
      link.click();
    } else {
      await Sharing.shareAsync(uri);
    }
  } catch (e) {
    Alert.alert("Download failed", e.message);
  }
};

export default function FinalLetterScreen() {
  const params = useLocalSearchParams();
  const { letter } = useLetter();
  const { receiverDetails } = useReceiverForLetter();
  const templateId = params.templateId;
  const paperStyle = templateStyles[templateId] || templateStyles['1'];

  const letterContent = letter || params.letter || "";
  const viewShotRef = useRef(null);
  const [loading, setLoading] = useState(false);

  /* -------------------- SUBMIT HANDLER -------------------- */
  const handleSubmitLetter = async () => {
    try {
      setLoading(true);

      const sender_id =
        receiverDetails?.sender_id || params.sender_id || "USER123";

      const receiver =
        receiverDetails?.receiver || receiverDetails || {};

      if (Platform.OS === "web") {
        const payload = {
          izhaar_code:
            params.izhaar_code || receiverDetails?.izhaar_code || "IZHAAR123",
          sender_id,
          type: "LETTER",
          message: letterContent,
          receiver,
          template_id: templateId, // send as template_id
        };
        console.log('Submitting letter payload:', payload);
        await api.post("/izhaar/submit", payload);
      } else {
        const uri = await viewShotRef.current.capture();
        if (!uri) throw new Error("Capture failed");

        const izhaar_code = params.izhaar_code || receiverDetails?.izhaar_code || "IZHAAR123";
        const formData = new FormData();
        formData.append("file", {
          uri,
          name: `izhaar-letter-${Date.now()}.png`,
          type: "image/png",
        });
        formData.append("izhaar_code", izhaar_code); // Ensure izhaar_code is always sent
        formData.append("sender_id", sender_id);
        formData.append("type", "LETTER");
        formData.append("message", letterContent);
        formData.append("receiver", JSON.stringify(receiver));
        formData.append("template_id", templateId); // send as template_id

        console.log('Submitting letter FormData:', {
          izhaar_code,
          sender_id,
          type: "LETTER",
          message: letterContent,
          receiver,
          template_id: templateId,
          file: uri
        });
        await api.post("/izhaar/submit", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      Alert.alert("Success ❤️", "Letter sent beautifully");
    } catch (err) {
      Alert.alert("Error", err.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      {/* ---------------- REAL LETTER PAPER ---------------- */}
      <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1 }}>
        <View style={[styles.paper, paperStyle]}>
          {/* Show templateId for clarity */}
          <Text style={{ textAlign: 'right', color: '#888', fontSize: 12, marginBottom: 8 }}>
            Template ID: {templateId}
          </Text>
          <Text style={styles.letterText}>{letterContent}</Text>
          <Text style={styles.signature}>
            With all my love,
          </Text>
        </View>
      </ViewShot>

      {/* ---------------- ACTIONS ---------------- */}
      <View style={styles.actions}>
       
        <TouchableOpacity
          style={[styles.btn, loading && { opacity: 0.6 }]}
          onPress={handleSubmitLetter}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Submit Letter</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  page: {
    paddingVertical: 32,
    alignItems: "center",
    backgroundColor: "#f4f1ec", // soft desk background
  },

  paper: {
    width: 360,
    backgroundColor: "#fffaf5", // paper tone
    paddingVertical: 36,
    paddingHorizontal: 28,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },

  letterText: {
    fontSize: 20,
    lineHeight: 32,
    color: "#2b2b2b",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    letterSpacing: 0.3,
    textAlign: "left",
  },

  signature: {
    marginTop: 32,
    fontSize: 18,
    fontStyle: "italic",
    color: "#444",
  },

  actions: {
    flexDirection: "row",
    marginTop: 28,
    gap: 16,
  },

  btn: {
    backgroundColor: "#ff4d6d",
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 10,
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
