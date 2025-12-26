import { useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import api from "../../utils/api";
export default function IzhaarNotification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProfileAndNotifications = async () => {
      setLoading(true);
      try {
        // Fetch profile to get mobile number
        const profileRes = await api.get("/profile/me");
        console.log('[Profile] Full response:', JSON.stringify(profileRes.data, null, 2));
        const profileData = profileRes.data.profile || profileRes.data;
        const userMobile = profileData.mobile;
        console.log('[Profile] Mobile:', userMobile);
        setMobile(userMobile);
        if (!userMobile) {
          setNotifications([]);
          setLoading(false);
          return;
        }
        // Fetch notifications using mobile
        const notifRes = await api.get(`/notification/izhaar/${userMobile}`);
        console.log('API response:', notifRes.data);
        const notifs = Array.isArray(notifRes.data?.izhaar) ? notifRes.data.izhaar : [];
        setNotifications(notifs);
        console.log('Notifications set:', notifs);
      } catch (e) {
        console.log('Error fetching profile or notifications:', e);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndNotifications();
  }, []);

  const handleNotificationPress = async (item) => {
    try {
      if (item.izhaar_code || item.code) {
        await api.patch(`/izhaar/status/${item.izhaar_code || item.code}`);
      }
    } catch (e) {
      // Optionally handle error
    }
    router.push({ pathname: '/user/notifictions/IzhaarNotificationDetail', params: { izhaar: JSON.stringify(item) } });
  };

  const renderItem = ({ item }) => (
    <Pressable onPress={() => handleNotificationPress(item)} style={styles.card}>
      <Text style={styles.liveText}>Someone is sending you an Izhaar. The Izhaar code is:</Text>
      <Text style={styles.code}>{item.izhaar_code || item.code || "N/A"}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
     <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backIcon}>{'<'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={{ width: 36 }} />
        </View>
      {notifications.length === 0 && !loading ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyText}>No Izhaar notifications</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item, idx) => item.id?.toString() || idx.toString()}
          renderItem={renderItem}
          refreshing={loading}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    marginBottom: 8,
  },
  backIcon: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    lineHeight: 28,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: 1.1,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 18,
  },
  emptyText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff4f7',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffd5e4',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  liveText: {
    fontSize: 14,
    color: '#ff3a76',
    fontWeight: '600',
    marginBottom: 6,
  },
  code: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff3a76',
    marginBottom: 4,
  },
  receiver: {
    fontSize: 14,
    color: '#222',
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    color: '#444',
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  },
});
