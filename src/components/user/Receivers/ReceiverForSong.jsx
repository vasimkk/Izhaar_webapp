import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import api from "../../utils/api";
export default function ReceiverForSong() {
  const router = useRouter();

  const [receiverName, setReceiverName] = useState("");
  const [receiverMobile, setReceiverMobile] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiverInstagramId, setReceiverInstagramId] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidMobile = (value) => /^\d{10}$/.test(value.trim());
  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleSubmit = async () => {
    const hasValidMobile = isValidMobile(receiverMobile);
    const hasValidEmail = isValidEmail(receiverEmail);
    const hasInstagramId = !!receiverInstagramId.trim();

    if (!hasValidMobile && !hasValidEmail && !hasInstagramId) {
      Alert.alert("Error", "Enter at least one: Mobile or Email or Instagram ID");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        receiverName: receiverName.trim() || null,
        receiverMobile: hasValidMobile ? receiverMobile : null,
        receiverEmail: hasValidEmail ? receiverEmail : null,
        receiverInstagramId: hasInstagramId ? receiverInstagramId : null,
      };

      console.log("Submitting payload:", payload);
      const res = await api.post("/chat/receiver", payload);
      console.log("Response:", res.data);

      Alert.alert("Success", "Receiver details submitted successfully!", [
        {
          text: "OK",
          onPress: () => {
            setReceiverName("");
            setReceiverMobile("");
            setReceiverEmail("");
            setReceiverInstagramId("");
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.log("Error details:", error.response?.status, error.response?.data);
      Alert.alert(
        "Error",
        error.response?.data?.message || error.message || "Failed to submit receiver details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setReceiverName("");
    setReceiverMobile("");
    setReceiverEmail("");
    setReceiverInstagramId("");
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      {/* HEADER */}
      <View style={styles.header}>
        {/* <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable> */}
        {/* <Text style={styles.headerTitle}>Receiver Details</Text> */}
        <View style={styles.placeholder} />
      </View>

      {/* SIMPLE FORM */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Enter Receiver Details</Text>
        {/* Name Input */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>
            Receiver Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            autoCapitalize="words"
            value={receiverName}
            onChangeText={setReceiverName}
            editable={!loading}
          />
        </View>

        {/* Mobile Input */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>
            Mobile Number <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="10-digit mobile"
            keyboardType="number-pad"
            maxLength={10}
            value={receiverMobile}
            onChangeText={setReceiverMobile}
            editable={!loading}
          />
        </View>

        {/* Email Input */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Email Address(optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={receiverEmail}
            onChangeText={setReceiverEmail}
            editable={!loading}
          />
        </View>

        {/* Instagram Input */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Instagram ID(optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="@username"
            autoCapitalize="none"
            value={receiverInstagramId}
            onChangeText={setReceiverInstagramId}
            editable={!loading}
          />
        </View> 
        {/* Submit Button */}
        <Pressable
          style={[
            styles.submitBtn,
            loading && styles.submitBtnDisabled,
            (!isValidMobile(receiverMobile) && 
             !isValidEmail(receiverEmail) && 
             !receiverInstagramId.trim()) && styles.submitBtnDisabled
          ]}
          onPress={handleSubmit}
          disabled={
            loading ||
            (!isValidMobile(receiverMobile) &&
              !isValidEmail(receiverEmail) &&
              !receiverInstagramId.trim())
          }
        >
          <Text style={styles.submitBtnText}>
            {loading ? "Submitting..." : "Submit"}
          </Text>
        </Pressable>

        {/* Cancel Button */}
        <Pressable style={styles.cancelBtn} onPress={handleCancel} disabled={loading}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "#ff3a76",
  },
  backBtn: {
    padding: 5,
  },
  backIcon: {
    fontSize: 24,
    color: "#fff",
  },
  // headerTitle: {
  //   fontSize: 18,
  //   fontWeight: "700",
  //   color: "#fff",
  //  textAlign:"center"
  // },
  placeholder: {
    width: 30,
  },
  formContainer: {
    flex: 1,
    padding: 25,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
  },
  noteText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 25,
  },
  submitBtn: {
    backgroundColor: "#ff3a76",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  submitBtnDisabled: {
    backgroundColor: "#ccc",
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelBtn: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelBtnText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  required: {
    color: 'red',
    fontWeight: 'bold',
  },
});
