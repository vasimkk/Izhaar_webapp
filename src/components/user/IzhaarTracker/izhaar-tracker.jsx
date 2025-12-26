// app/user/izhaar-tracker.js

import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View , Pressable } from "react-native";
import api from "../../utils/api";
import { useRouter } from "expo-router";

const getReceiverLabel = (item = {}) => {
  const receiver = item.receiverDetails || {};
  return (
    item.receiverMobile || receiver.mobile ||
    item.receiverEmail || receiver.email ||
    item.receiverInstagramId || receiver.instagram ||
    receiver.name || "Unknown"
  );
};

export default function IzhaarTracker() {
  const [loading, setLoading] = useState(false);
  const [allCodes, setAllCodes] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const fetchAllIzhaar = async () => {
      try {
        setLoading(true);
        const res = await api.get("/izhaar/all");
        const izhaarList = Array.isArray(res.data?.izhaar) ? res.data.izhaar : [];
        setAllCodes(izhaarList);
      } catch (e) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchAllIzhaar();
  }, []);

  const renderCodeItem = ({ item }) => (
    <View style={styles.cardShadow}>
      <View style={styles.izhaarCard}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.izhaarCode}>{item.izhaar_code || item.code || "N/A"}</Text>
          <View style={[styles.statusBadge, item.status === "SENT" ? styles.statusSent : styles.statusOther]}>
            <Text style={styles.statusText}>{item.status || "-"}</Text>
          </View>
        </View>
        <Text style={styles.receiverText}>To: <Text style={{fontWeight:'700'}}>{item.receiver_name || item.receiver_mobile || item.receiver_email || item.receiver_instagram || "Unknown"}</Text></Text>
        <Text style={styles.messageLabel}>Message:</Text>
        <Text style={styles.messageText}>{item.message || "No message"}</Text>
        <Text style={styles.dateText}>{item.created_at ? new Date(item.created_at).toLocaleString() : ""}</Text>
      </View>
    </View>
  );
// ...existing code...

  return (
    <View style={styles.container}>
       <View style={styles.headerRow}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                  <Text style={styles.backIcon}>{'<'}</Text>
                </Pressable>
                <Text style={styles.headerTitle}>Izhaar Tracker</Text>
                <View style={{ width: 36 }} />
              </View>
      <FlatList
        data={allCodes}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderCodeItem}
        refreshing={loading}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>
              {loading ? "Loading..." : "No Izhaar found"}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ff3a76',
    marginTop: 30,
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 1.2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 36,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 18,
    borderRadius: 16,
  },
  izhaarCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#ffe0eb',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  izhaarCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff3a76',
    letterSpacing: 1.1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#ffd700',
    alignSelf: 'flex-start',
  },
  statusSent: {
    backgroundColor: '#ffd700',
  },
  statusOther: {
    backgroundColor: '#ccc',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  receiverText: {
    fontSize: 15,
    color: '#222',
    marginBottom: 4,
  },
  messageLabel: {
    fontSize: 13,
    color: '#888',
    marginTop: 8,
    marginBottom: 2,
    fontWeight: '600',
  },
  messageText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 6,
  },
  container: { flex: 1, backgroundColor: "black" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "#ff3a76",
  },
  backBtn: { padding: 5 },
  backIcon: { fontSize: 24, color: "#fff" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#fff", flex: 1, textAlign: "center" },
  refreshBtn: { padding: 5 },
  refreshIcon: { fontSize: 24, color: "#fff" },
  searchContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statsText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ff3a76",
  },
  searchInput: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
  },
  listContent: { padding: 15 },
  codeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ffe0eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  codeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  codeText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    flex: 1,
  },
  statusBadge: {
    backgroundColor: "#ffd700",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDelivered: {
    backgroundColor: "#25d366",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  detailsSection: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  detailText: {
    fontSize: 13,
    color: "#666",
    flex: 1,
  },
  dateText: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  emptyIcon: { fontSize: 60, marginBottom: 15 },
  emptyText: { fontSize: 16, fontWeight: "600", color: "#999" },
});