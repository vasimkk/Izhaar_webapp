// app/user/izhaar-detail.js

import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import api from "../../utils/api";

const getReceiverLabel = (item = {}) => {
  // Prefer direct fields, then nested receiverDetails if provided by API
  const receiver = item.receiverDetails || {};
  if (item.receiverMobile || receiver.mobile) return item.receiverMobile || receiver.mobile;
  if (item.receiverEmail || receiver.email) return item.receiverEmail || receiver.email;
  if (item.receiverInstagramId || receiver.instagram) return `@${item.receiverInstagramId || receiver.instagram}`;
  if (receiver.name) return receiver.name;
  return null;
};

const formatStatus = (status, item) => {
  if (!status) return "Pending";
  if (status.toLowerCase() === "anonymous") {
    const receiver = getReceiverLabel(item);
    return receiver || "Anonymous sender";
  }
  return status;
};

export default function IzhaarDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (params.data) {
      // If full data is passed from tracker, use it directly
      try {
        setDetails(JSON.parse(params.data));
        setLoading(false);
      } catch (e) {
        console.log("Error parsing data:", e);
        setLoading(false);
      }
    } else if (params.code) {
      // Otherwise fetch from API
      fetchCodeDetails(params.code);
    }
  }, [params]);

  const fetchCodeDetails = async (code, isAutoRefresh = false) => {
    try {
      if (isAutoRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const res = await api.get(`/chat/receiver/${code}/status`);
      // Some endpoints wrap payload under data; fall back to raw body
      const payload = res?.data?.data || res?.data;
      setDetails(payload);
    } catch (e) {
      console.log("Error fetching details:", e.response?.data || e.message);
      if (!isAutoRefresh) {
        Alert.alert("Error", e?.response?.data?.message || "Failed to load code details");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    if (params.code && !refreshing) {
      fetchCodeDetails(params.code, true);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return '#25d366';
      case 'sent':
        return '#4a90e2';
      case 'pending':
        return '#ffd700';
      default:
        return '#999';
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'sent':
        return '#ff3a76';
      case 'received':
        return '#25d366';
      default:
        return '#666';
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Loading...</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff3a76" />
        </View>
      </View>
    );
  }

  if (!details) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Code Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>❌</Text>
          <Text style={styles.emptyText}>No details found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Code Details</Text>
        <Pressable 
          onPress={handleRefresh} 
          style={styles.refreshBtn}
          disabled={refreshing}
        >
          {refreshing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.refreshIcon}>🔄</Text>
          )}
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        {/* CODE CARD */}
        <View style={styles.codeSection}>
          <Text style={styles.sectionTitle}>Izhaar Code</Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{details.code || details.izhaarCode || "N/A"}</Text>
          </View>
        </View>

        {/* STATUS SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(details.status) }]}>
                <Text style={styles.statusText}>{formatStatus(details.status, details)}</Text>
              </View>
            </View>

            {details.type && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Type:</Text>
                <View style={[styles.typeBadge, { backgroundColor: getTypeColor(details.type) }]}>
                  <Text style={styles.typeText}>{details.type}</Text>
                </View>
              </View>
            )}

            {details.senderId && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Sender ID:</Text>
                <Text style={styles.infoValue}>{details.senderId}</Text>
              </View>
            )}
          </View>
        </View>

        {/* RECEIVER INFORMATION */}
        {(details.receiverName || details.receiverMobile || details.receiverEmail || details.receiverInstagramId) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Receiver Information</Text>
            <View style={styles.infoCard}>
              {details.receiverName && (
                <View style={styles.contactRow}>
                  <Text style={styles.contactIcon}>👤</Text>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Name</Text>
                    <Text style={styles.contactValue}>{details.receiverName}</Text>
                  </View>
                </View>
              )}

              {details.receiverMobile && (
                <View style={styles.contactRow}>
                  <Text style={styles.contactIcon}>📱</Text>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Mobile</Text>
                    <Text style={styles.contactValue}>{details.receiverMobile}</Text>
                  </View>
                </View>
              )}

              {details.receiverEmail && (
                <View style={styles.contactRow}>
                  <Text style={styles.contactIcon}>✉️</Text>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Email</Text>
                    <Text style={styles.contactValue}>{details.receiverEmail}</Text>
                  </View>
                </View>
              )}

              {details.receiverInstagramId && (
                <View style={styles.contactRow}>
                  <Text style={styles.contactIcon}>📷</Text>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Instagram</Text>
                    <Text style={styles.contactValue}>@{details.receiverInstagramId}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* TIMELINE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          <View style={styles.infoCard}>
            {details.createdAt && (
              <View style={styles.timelineRow}>
                <Text style={styles.timelineIcon}>🕐</Text>
                <View style={styles.timelineInfo}>
                  <Text style={styles.timelineLabel}>Created</Text>
                  <Text style={styles.timelineValue}>
                    {new Date(details.createdAt).toLocaleDateString()} at{" "}
                    {new Date(details.createdAt).toLocaleTimeString()}
                  </Text>
                </View>
              </View>
            )}

            {details.updatedAt && (
              <View style={styles.timelineRow}>
                <Text style={styles.timelineIcon}>🔄</Text>
                <View style={styles.timelineInfo}>
                  <Text style={styles.timelineLabel}>Last Updated</Text>
                  <Text style={styles.timelineValue}>
                    {new Date(details.updatedAt).toLocaleDateString()} at{" "}
                    {new Date(details.updatedAt).toLocaleTimeString()}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "#ff3a76",
  },
  backBtn: { padding: 5 },
  backIcon: { fontSize: 24, color: "#fff" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#fff", flex: 1, textAlign: "center" },
  refreshBtn: { padding: 5, minWidth: 30, alignItems: "center", justifyContent: "center" },
  refreshIcon: { fontSize: 20, color: "#fff" },
  placeholder: { width: 30 },
  content: { flex: 1, padding: 15 },
  codeSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#666", marginBottom: 10, textTransform: "uppercase" },
  codeBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ff3a76",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  codeText: { fontSize: 20, fontWeight: "700", color: "#ff3a76", letterSpacing: 1 },
  section: { marginBottom: 20 },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: { fontSize: 14, fontWeight: "600", color: "#666", flex: 1 },
  infoValue: { fontSize: 14, color: "#333", fontWeight: "600" },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: { fontSize: 12, fontWeight: "700", color: "#fff" },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeText: { fontSize: 12, fontWeight: "700", color: "#fff" },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  contactIcon: { fontSize: 24, marginRight: 12 },
  contactInfo: { flex: 1 },
  contactLabel: { fontSize: 11, color: "#999", marginBottom: 2 },
  contactValue: { fontSize: 15, color: "#333", fontWeight: "600" },
  timelineRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  timelineIcon: { fontSize: 20, marginRight: 12 },
  timelineInfo: { flex: 1 },
  timelineLabel: { fontSize: 11, color: "#999", marginBottom: 2 },
  timelineValue: { fontSize: 13, color: "#333", fontWeight: "500" },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyIcon: { fontSize: 60, marginBottom: 15 },
  emptyText: { fontSize: 16, fontWeight: "600", color: "#999" },
});
