import api from "@/app/utils/api";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { USER_DASHBOARD } from "../../config/routes";
export default function SelectTemplate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: 1,
      title: "I want to confess my feelings",
      color: "#FFB3BA",
      emoji: "💕",
      description: "Express your heartfelt emotions",
    },
    {
      id: 2,
      title: "I received an IZHAAR code",
      color: "#BAA5FF",
      emoji: "🔐",
      description: "Open a confession sent to you",
    },
    {
      id: 3,
      title: "I want to compliment a friend",
      color: "#AED8FF",
      emoji: "🎉",
      description: "Appreciate someone special",
    },
    {
      id: 4,
      title: "I want to explore",
      color: "#FFE4A3",
      emoji: "🌟",
      description: "Discover what Izhaar can do",
    },
  ];

  const handleTemplateSelect = async (template) => {
    setSelectedTemplate(template.id);

    try {
      setLoading(true);

      // Send selected template to backend
      const response = await api.post("/user/template-selection", {
        templateId: template.id,
        templateTitle: template.title,
      });

      console.log("Template selection saved:", response.data);

      // Navigate to dashboard with replace (no back button)
      router.replace(USER_DASHBOARD);
    } catch (error) {
      console.error("Error saving template selection:", error);
      alert(error.response?.data?.message || "Failed to save selection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome to Izhaar 💕</Text>
          <Text style={styles.headerSubtitle}>
            Choose what you'd like to do
          </Text>
        </View>

        {/* TEMPLATE OPTIONS */}
        <View style={styles.templatesContainer}>
          {templates.map((template) => (
            <Pressable
              key={template.id}
              style={[
                styles.templateCard,
                { backgroundColor: template.color },
                selectedTemplate === template.id && styles.templateCardSelected,
              ]}
              onPress={() => handleTemplateSelect(template)}
              disabled={loading}
            >
              <View style={styles.cardContent}>
                <View style={styles.textContainer}>
                  <Text style={styles.templateTitle}>{template.title}</Text>
                  <Text style={styles.templateDescription}>
                    {template.description}
                  </Text>
                </View>
                <Text style={styles.templateEmoji}>{template.emoji}</Text>
              </View>

              {loading && selectedTemplate === template.id && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="small" color="#fff" />
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* INFO TEXT */}
        <Text style={styles.infoText}>
          Your selection helps us personalize your Izhaar experience 💖
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  templatesContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  templateCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    minHeight: 100,
    position: "relative",
  },
  templateCardSelected: {
    borderWidth: 3,
    borderColor: "#ff3a76",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  templateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 6,
  },
  templateDescription: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  templateEmoji: {
    fontSize: 48,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    textAlign: "center",
    fontSize: 14,
    color: "#999",
    marginTop: 20,
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});
