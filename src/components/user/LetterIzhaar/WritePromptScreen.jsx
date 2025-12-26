import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View
} from "react-native";
import { BASE_URL } from "../../config/config";
import { useLetter } from "../../context/LetterContext";
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const STEPS = [
  {
    key: "senderName",
    actorText: "Enter your name that would be mention in letter",
    placeholder: "Type your name...",
    type: "text",
    optional: true,
  },
  {
    key: "receiverName",
    actorText: "Nice to meet you!\nWho are we writing this letter to?",
    placeholder: "e.g. Sarah, Mom, My Love...",
    type: "text",
    optional: false,
  },
  {
    key: "tone",
    actorText: "What kind of an letter you wanna send to ur love?",
    type: "selection",
    options: [
      "Love letter❤️",
      "Funny letter😂",
      "Flirty letter 😉",
      "Sorry letter",
    ],
    optional: false,
  },
  {
    key: "attributes",
    actorText: "Tell me about them.\nWhat specific traits do you love?",
    placeholder: "e.g. Their smile, patience, kindness...",
    type: "text",
    multiline: true,
    optional: false,
  },
  {
    key: "moment",
    actorText: "Almost done!\nIs there a special memory to include?",
    placeholder: "e.g. Our trip to the beach...",
    type: "text",
    multiline: true,
    optional: false,
  },
];

export default function WritePromptScreen() {
  const { setLetter } = useLetter();
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params?.data) {
      try {
        const parsed = JSON.parse(params.data);
        console.log("Received param data:", parsed);
      } catch (e) {
        console.log("Param data (raw):", params.data);
      }
    }
  }, [params]);

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentInput, setCurrentInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState(null);

  useEffect(() => {
    const stepKey = STEPS[currentStep]?.key;
    setCurrentInput(answers[stepKey] || "");
  }, [currentStep]);

  const handleNext = async () => {
    const step = STEPS[currentStep];
    if (!step.optional && !currentInput && step.type === "text") return;
    const updated = { ...answers, [step.key]: currentInput };
    setAnswers(updated);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateLetter(updated);
    }
  };

  const handleSelectOption = async (option) => {
    const clean = option.split(" ")[0];
    const updated = { ...answers, [STEPS[currentStep].key]: clean };
    setAnswers(updated);
    setCurrentInput(clean);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (currentStep < STEPS.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 250);
    } else {
      generateLetter(updated);
    }
  };

  const handleBack = async () => {
    if (currentStep > 0) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    const step = STEPS[currentStep];
    const updated = { ...answers, [step.key]: "" };
    setAnswers(updated);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateLetter(updated);
    }
  };

  // ------------------------------------------------------------------
  // 🔥 REAL AI LETTER GENERATION API (NO MOCK)
  // ------------------------------------------------------------------
  const generateLetter = async (finalAns) => {
    setLoading(true);
    try {
      const fullPrompt = `
Write a ${finalAns.tone} letter.

Sender: ${finalAns.senderName || "Anonymous"}
Receiver: ${finalAns.receiverName}

Attributes to include:
${finalAns.attributes}

Special Memory:
${finalAns.moment}

Rules:
- Maximum 120 words
- Make it emotional, human-like, and personalized
- Natural flow, easy to read
- Use simple language
- Add small shayari or poetry lines naturally based on letter language
- Add a light joke if it fits the mood
- Add emojis to increase emotional feeling 😊❤️✨
- Avoid technical or complex words
- Keep tone warm, sweet, and relatable

`;

      const payload = {
        systemInstruction: {
          role: "system",
          parts: [{ text: "You write human-like emotional letters." }],
        },
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 1,
          maxOutputTokens: 300,
          topP: 0.95,
          topK: 64,
        },
      };

      const response = await fetch(`${BASE_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.finalLetter) {
        Alert.alert("Error", "AI could not generate a letter.");
        setLoading(false);
        return;
      }

      setGeneratedLetter(data.finalLetter);
      setLetter(data.finalLetter);
      setLoading(false);
    } catch (err) {
      console.log("Letter generation error:", err);
      Alert.alert("Error", "Failed to generate letter.");
      setLoading(false);
    }
  };

  // ------------------------- RESULT SCREEN -------------------------
  if (generatedLetter) {
    return (
      <View style={styles.resultContainer}>
        <View style={styles.resultHeader}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={40} color="#fff" />
          </View>
          <Text style={styles.resultTitle}>Letter Ready!</Text>
        </View>

        <ScrollView style={styles.letterScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.letterText}>{generatedLetter}</Text>
        </ScrollView>

        <View style={styles.resultActions}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.push("/user/LetterIzhaar/TemplateScreen")}
          >
            <Text style={styles.primaryBtnText}>Select Template</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => {
              setGeneratedLetter(null);
              setCurrentStep(0);
              setCurrentInput("");
              setAnswers({});
            }}
          >
            <Text style={styles.secondaryBtnText}>Regenerate</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ------------------------- QUESTION WIZARD -------------------------
  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.questionWrapper}>
          <Text style={styles.questionText}>{step.actorText}</Text>
        </View>

        <View style={styles.contentArea}>
          {step.type === "selection" ? (
            <View style={styles.optionsGrid}>
              {step.options.map((option) => {
                const isSelected = currentInput === option.split(" ")[0];
                return (
                  <TouchableOpacity
                    key={option}
                    style={[styles.optionChip, isSelected && styles.optionChipSelected]}
                    onPress={() => handleSelectOption(option)}
                  >
                    <Text
                      style={[styles.optionText, isSelected && styles.optionTextSelected]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.inputCard}>
              <TextInput
                style={[styles.input, step.multiline && styles.multilineInput]}
                placeholder={step.placeholder}
                placeholderTextColor="#aaa"
                value={currentInput}
                onChangeText={setCurrentInput}
                multiline={step.multiline}
                textAlignVertical="top"
              />
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          {currentStep > 0 && (
            <TouchableOpacity onPress={handleBack} style={styles.navBtn}>
              <Ionicons name="arrow-back" size={22} color="black" />
            </TouchableOpacity>
          )}
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          {step.optional && !currentInput && step.type !== "selection" && (
            <TouchableOpacity onPress={handleSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}

          {step.type !== "selection" && (
            <TouchableOpacity
              onPress={handleNext}
              disabled={!step.optional && !currentInput}
              style={[styles.nextBtn, (!step.optional && !currentInput) && styles.nextBtnDisabled]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Ionicons name="arrow-forward" size={24} color="#fff" />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },

  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 10,
    backgroundColor: "#111",
  },
  progressContainer: {
    height: 6,
    backgroundColor: "#eee",
    borderRadius: 3,
    marginBottom: 15,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FF4D6D",
    borderRadius: 3,
  },
  headerControls: { flexDirection: "row", justifyContent: "flex-end" },
  iconBtn: { padding: 6 },

  scrollContent: { flexGrow: 1, padding: 24, paddingBottom: 140 },

  questionWrapper: { marginTop: 20, marginBottom: 40 },
  questionText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 36,
  },

  contentArea: { flex: 1 },

  inputCard: {
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#222",
  },
  input: { fontSize: 18, color: "#fff", padding: 0 },
  multilineInput: { minHeight: 120 },

  optionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  optionChip: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: "#111",
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "#222",
  },
  optionChipSelected: {
    backgroundColor: "#222",
    borderColor: "#FF4D6D",
  },
  optionText: { fontSize: 16, fontWeight: "600", color: "#fff" },
  optionTextSelected: { color: "#FF4D6D" },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#111",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "black",
    paddingBottom: 50
  },

  navBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },

  skipText: { color: "#aaa", fontSize: 16, fontWeight: "600" },

  nextBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  nextBtnDisabled: { backgroundColor: "#ddd" },

  resultContainer: { flex: 1, backgroundColor: "#111", paddingTop: 80, paddingHorizontal: 24 },
  resultHeader: { alignItems: "center", marginBottom: 30 },
  successIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#22C55E",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  resultTitle: { fontSize: 20, fontWeight: "800", color: "#e99797ff" },
  letterScroll: {
    flex: 1,
    backgroundColor: "#ffc7c7ff",
    borderRadius: 18,
    padding: 24,
    marginBottom: 30,
  },
  letterText: {
    fontSize: 18,
    lineHeight: 26,
    color: "black",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  resultActions: { paddingBottom: 50, gap: 12 },
  primaryBtn: {
    backgroundColor: "#ff5070ff",
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  secondaryBtn: {
    backgroundColor: "#333",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },
  secondaryBtnText: { color: "#ccc", fontWeight: "600", fontSize: 16 },
});
