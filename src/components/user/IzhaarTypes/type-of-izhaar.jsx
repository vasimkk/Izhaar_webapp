import { useRouter } from "expo-router";
import React from "react";
import { Alert, Dimensions, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ONLINE_IZHAAR } from "../../config/routes";
import { RECEIVER_FORM_TEXT, Letter_IZHAAR ,RECEIVER_FORM} from '../../config/routes';

const options = [
  {
    id: "online",
    title: "Online Izhaar",
    description: "Generate and send a digital Izhaar with an Izhaar code, ready to share instantly.",
    info: "Online Izhaar creates a digital letter using AI. You can share it via an Izhaar code or link so the recipient can read it inside the app.",
    target: ONLINE_IZHAAR,
  },
  {
    id: "offline",
    title: "Offline Izhaar",
    description: "Pick a template, personalize it, and download or print it to hand over in person.",
    info: "Offline Izhaar lets you choose a design, add your words, then export or print it. Perfect for in-person surprises.",
  },
];

export default function TypeOfIzhaar() {
  const router = useRouter();
  const [showMenu, setShowMenu] = React.useState(false);

  const handleInfo = (option) => {
    Alert.alert(option.title, option.info);
  };

  const handleSelect = (option) => {
    if (option.id === "online") {
      setShowMenu(true);
    } else {
      router.push(option.target);
    }
  };

  // Menu items for the big left menu
  const menuItems = [
    { icon: '', label: 'Letter Izhaar', onPress: () => { setShowMenu(false); router.push(Letter_IZHAAR); } },
    { icon: '', label: 'Simple Izhaar', onPress: () => { setShowMenu(false); router.push(RECEIVER_FORM_TEXT); } },

  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Choose your Izhaar</Text>
        <Text style={styles.title}>How do you want to express?</Text>
        <Text style={styles.subtitle}>
          Pick a flow that fits the moment. You can always come back and switch.
        </Text>
      </View>

      <View style={styles.cardGrid}>
        {options.map((option) => (
          <Pressable
            key={option.id}
            style={styles.card}
            onPress={() => handleSelect(option)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{option.title}</Text>
            </View>
            <Text style={styles.cardDescription}>{option.description}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardArrow}>Continue→</Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Big Left Side Menu Modal */}
      <Modal
        visible={showMenu}
        animationType="slide"
        transparent
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={() => setShowMenu(false)}>
          <View style={styles.bigMenuContainer}>
            <Text style={styles.bigMenuHeader}>Online Izhaar</Text>
            {menuItems.map((item, idx) => (
              <TouchableOpacity
                key={item.label}
                style={styles.bigMenuItem}
                onPress={item.onPress}
              >
                <Text style={styles.bigMenuIcon}>{item.icon}</Text>
                <Text style={styles.bigMenuLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    flexDirection: 'row',
  },
  bigMenuContainer: {
    width: Dimensions.get('window').width * 0.75,
    backgroundColor: '#222',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderTopRightRadius: 32,
    borderBottomRightRadius: 32,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  bigMenuHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 32,
    alignSelf: 'flex-start',
  },
  bigMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 0,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  bigMenuIcon: {
    fontSize: 28,
    marginRight: 18,
    color: '#fff',
  },
  bigMenuLabel: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 24,
  },
  kicker: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ff3a76",
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#fff",
    lineHeight: 20,
  },
  cardGrid: {
    gap: 16,
  },
  card: {
    backgroundColor: "#fff7fa",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#ffe0eb",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  infoBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#ff3a76",
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  cardDescription: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardCta: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ff3a76",
  },
  cardArrow: {
    fontSize: 18,
    color: "#ff3a76",
  },
});
