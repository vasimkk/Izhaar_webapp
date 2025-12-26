// app/user/dashboard.js
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { CHAT_INTERFACE, IZHAAR_NOTIFICATION, TYPE_OF_IZHAAR, USER_PROFILE_VIEW } from "../config/routes";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function UserDashboard() {
  const router = useRouter();
  const auth = useAuth();
  const [notifCount, setNotifCount] = useState(0);
  const [notifLoading, setNotifLoading] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    let intervalId;
    let userMobile = null;
    let soundObject = null;
    const playBeep = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/mixkit-bell-notification-933.wav'),
          { shouldPlay: true }
        );
        soundObject = sound;
      } catch (e) {}
    };
    const fetchProfileAndNotif = async (isInitial = false) => {
      if (isInitial) setNotifLoading(true);
      try {
        if (isInitial || !userMobile) {
          const profileRes = await api.get("/profile/me");
          const profileData = profileRes.data.profile || profileRes.data;
          setUsername(profileData.username || profileData.name || "User");
          userMobile = profileData.mobile;
        }
        if (!userMobile) {
          setNotifCount(0);
          if (isInitial) setNotifLoading(false);
          return;
        }
        const notifRes = await api.get(`/notification/izhaar/${userMobile}`);
        const notifs = Array.isArray(notifRes.data?.izhaar) ? notifRes.data.izhaar : [];
        setNotifCount((prev) => {
          if (prev !== 0 && notifs.length > prev) {
            playBeep();
          }
          return notifs.length;
        });
      } catch (e) {
        setNotifCount(0);
      } finally {
        if (isInitial) setNotifLoading(false);
      }
    };
    fetchProfileAndNotif(true);
    intervalId = setInterval(() => fetchProfileAndNotif(false), 10000);
    return () => {
      clearInterval(intervalId);
      if (soundObject) soundObject.unloadAsync();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* HEADER WITH LOGO, NOTIFICATION */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={{ width: 55, height: 55, marginRight: 8 }}
            resizeMode="contain"
          />
        </View>
        <View style={styles.headerActions}>
          <Pressable onPress={() => router.push(IZHAAR_NOTIFICATION)}>
            <Image source={require('../../assets/images/notification.png')} style={styles.icon} />
            {notifCount > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{notifCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
      {/* MAIN CONTENT */}
      <View style={styles.content}>
        <Text style={styles.greeting}>Hello, {username}</Text>
        <Text style={styles.welcomeText}>Welcome on Izhaar Platform</Text>
      </View>
      {/* BOTTOM NAVIGATION */}
      <LinearGradient
        colors={['rgba(255,71,71,0.63)', 'rgba(206,114,255,0.63)', 'rgba(157,209,255,0.63)', 'rgba(255,210,97,0.63)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.footer}
      >
        <Pressable style={styles.footerBtn} onPress={() => router.replace("/user/dashboard")}> 
          <Image source={require('../../assets/images/home.png')} style={styles.footerIconImg} />
          <Text style={styles.footerLabel}>Home</Text>
        </Pressable>
        <Pressable style={styles.footerBtn} onPress={() => router.push(TYPE_OF_IZHAAR)}>
          <Image source={require('../../assets/images/confession.png')} style={styles.footerIconImg} />
          <Text style={styles.footerLabel}>Confession</Text>
        </Pressable>
        <Pressable style={styles.footerBtn} onPress={() => router.push(CHAT_INTERFACE)}>
          <Image source={require('../../assets/images/chat.png')} style={styles.footerIconImg} />
          <Text style={styles.footerLabel}>Chat</Text>
        </Pressable>
        <Pressable style={styles.footerBtn} onPress={() => router.push(USER_PROFILE_VIEW)}>
          <Image source={require('../../assets/images/profile.png')} style={styles.footerIconImg} />
          <Text style={styles.footerLabel}>Profile</Text>
        </Pressable>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "black",
  },
  logo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ff3a76",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 25,
    height: 25,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    color:"white"
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 30,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    marginBottom:40,
    marginLeft:10,
    marginRight:10,
    borderRadius:15
  },
  footerBtn: {
    alignItems: "center",
    gap: 4,
  },
  footerIconImg: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 2,
  },
  footerLabel: {
    fontSize: 11,
    fontWeight: "500",
  },
  notifBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ff3a76',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  notifBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
