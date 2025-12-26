import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { FINAL_LETTER } from '../../config/routes';
import { useLetter } from "../../context/LetterContext";

const templates = [
  { id: "1", title: "Romantic Pink", style: { backgroundColor: '#fffaf5', borderColor: '#ffb6b9' } },
  { id: "2", title: "Rose Love", style: { backgroundColor: '#fff0f5', borderColor: '#e75480' } },
  { id: "3", title: "Cute Couple", style: { backgroundColor: '#f0fff0', borderColor: '#a3d8f4' } },
  { id: "4", title: "Classic Letter", style: { backgroundColor: '#f5f5dc', borderColor: '#deb887' } },
];

export default function TemplateScreen() {
  const router = useRouter();
  const { letter } = useLetter(); // get letter from context
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleNext = () => {
    if (!selectedTemplate) return;
    router.push({
      pathname: FINAL_LETTER,
      params: { templateId: selectedTemplate, letter }, // templateId is sent here
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Love Letter Template</Text>

      <FlatList
        data={templates}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedTemplate === item.id;
          return (
            <Pressable
              onPress={() => setSelectedTemplate(item.id)}
              style={[styles.card, item.style, isSelected && styles.selectedCard]}
            >
              <Text style={styles.cardTitle}>{item.title}</Text>
              {isSelected && <Text style={styles.selectedText}>✓ Selected</Text>}
            </Pressable>
          );
        }}
      />

      <Pressable style={[styles.button, !selectedTemplate && { backgroundColor: "#ccc" }]} disabled={!selectedTemplate} onPress={handleNext}>
        <Text style={styles.buttonText}>Next →</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 50 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  card: { width: 180, height: 120, borderRadius: 12, padding: 10, marginRight: 15, alignItems: "center", justifyContent: "center", borderWidth: 2 },
  selectedCard: { borderWidth: 4, borderColor: "#ff4d6d" },
  cardTitle: { fontSize: 18, fontWeight: "bold", textAlign: "center" },
  selectedText: { marginTop: 5, color: "green", fontWeight: "bold" },
  button: { marginTop: 30, padding: 15, backgroundColor: "#ff4d6d", borderRadius: 10 },
  buttonText: { textAlign: "center", color: "#fff", fontSize: 18, fontWeight: "bold" },
});
