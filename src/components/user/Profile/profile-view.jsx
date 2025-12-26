import api from "@/app/utils/api";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ENTRY_PAGE, LOGIN } from "../../config/routes";
import { useAuth } from "../../context/AuthContext";
export default function ProfileViewScreen() {
  const router = useRouter();
  const auth = useAuth();

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    mobile: "",
    email: "",
    gender: "",
    age: "",
    profile_photo: "",
  });

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileRes = await api.get("/profile/me");
      const profile = profileRes.data.profile || profileRes.data;
      setProfileData(profile);
      setEditForm({
        name: profile.name || "",
        mobile: profile.mobile || "",
        email: profile.email || "",
        gender: profile.gender || "",
        age: profile.age ? String(profile.age) : "",
        profile_photo: profile.profile_photo || "",
      });
    } catch (err) {
      if (err.response?.status === 401) {
        await auth.clearAuth();
        router.replace(LOGIN);
      } else {
        Alert.alert("Error", "Could not load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Update profile
  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const payload = {
        name: editForm.name.trim(),
        mobile: editForm.mobile.trim(),
        email: editForm.email.trim(),
        gender: editForm.gender || null,
        age: parseInt(editForm.age) || null,
        profile_photo: editForm.profile_photo,
      };
      const res = await api.put("/profile/me", payload);
      setProfileData(res.data.profile);
      setEditing(false);
      Alert.alert("Success", "Profile updated!");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };


  // Log out logic (from user)
  const handleLogout = async () => {
    try {
      // If you have a menu, setMenuVisible(false); // not used here
      try {
        // Call logout endpoint
        await api.post("/auth/logout");
      } catch (err) {
        console.log("Logout API error:", err?.response?.status);
      }

      // Clear all auth state, tokens, and auto-refresh
      await auth.clearAuth();

      // Small delay to ensure state is cleared before navigation
      await new Promise(resolve => setTimeout(resolve, 100));

      // Navigate to login with fresh stack
      router.replace({ pathname: ENTRY_PAGE });
    } catch (e) {
      console.log("Logout error:", e);
    }
  };

  // Pick profile photo
  const pickProfilePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setEditForm((prev) => ({ ...prev, profile_photo: result.assets[0].uri }));
    }
  };

  if (loading && !profileData) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#ff3a76" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>No Profile Found</Text>
        <Text style={styles.errorText}>Create one to get started</Text>
        <Pressable style={styles.primaryBtn} onPress={() => router.back()}>
          <Text style={styles.primaryBtnText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  // View mode (Figma style)
  if (!editing) {
    return (
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backIcon}>{'<'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={{ alignItems: "center", marginTop: 10 }}>
          {profileData.profile_photo ? (
            <Image source={{ uri: profileData.profile_photo }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
          )}
          <Text style={styles.profileName}>{profileData.name}</Text>
          <Text style={styles.profileEmail}>{profileData.email}</Text>
          <Pressable style={styles.editBtn} onPress={() => setEditing(true)}>
            <Text style={styles.editBtnText}>Edit profile</Text>
          </Pressable>
        </View>
        {/* Options Card */}
        <View style={styles.optionsCard}>
          <Pressable style={styles.optionRow} onPress={() => router.push('/user/IzhaarTracker/izhaar-tracker')}>
            <Text style={styles.optionIcon}>📄</Text>
            <Text style={styles.optionText}>Izhaar Tracker</Text>
            <Text style={styles.optionChevron}>›</Text>
          </Pressable>
          <Pressable style={styles.optionRow} onPress={() => router.push('/user/Profile/privacy-policy')}>
            <Text style={styles.optionIcon}>🔒</Text>
            <Text style={styles.optionText}>Privacy Policy</Text>
            <Text style={styles.optionChevron}>›</Text>
          </Pressable>
          <Pressable style={[styles.optionRow, styles.logoutRow]} onPress={handleLogout} disabled={deleting}>
            <Text style={[styles.optionIcon, styles.logoutText]}>🚪</Text>
            <Text style={[styles.optionText, styles.logoutText]}>Log out</Text>
            {deleting ? <ActivityIndicator color="#ff3a76" size="small" /> : <Text style={[styles.optionChevron, styles.logoutText]}>›</Text>}
          </Pressable>
        </View>
      </View>
    );
  }

  // Edit mode (Figma style)
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "black" }} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={{ alignItems: "center", marginTop: 40 }}>
        <Pressable onPress={pickProfilePhoto} style={styles.editPhotoBtn}>
          {editForm.profile_photo ? (
            <Image source={{ uri: editForm.profile_photo }} style={styles.avatarEdit} />
          ) : (
            <View style={styles.avatarPlaceholderEdit}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
          )}
          <View style={styles.editPhotoIcon}><Text style={{ color: '#fff', fontSize: 18 }}>📷</Text></View>
        </Pressable>
      </View>
      <View style={styles.editFormSection}>
        <Text style={styles.editLabel}>Name</Text>
        <TextInput style={styles.editInput} value={editForm.name} onChangeText={text => setEditForm({ ...editForm, name: text })} />
        <Text style={styles.editLabel}>Phone Number</Text>
        <TextInput style={styles.editInput} value={editForm.mobile} onChangeText={text => setEditForm({ ...editForm, mobile: text })} keyboardType="phone-pad" />
        <Text style={styles.editLabel}>Gender</Text>
        <TextInput style={styles.editInput} value={editForm.gender} onChangeText={text => setEditForm({ ...editForm, gender: text })} placeholder="Select gender" />
        <Text style={styles.editLabel}>Age</Text>
        <TextInput style={styles.editInput} value={editForm.age} onChangeText={text => setEditForm({ ...editForm, age: text })} placeholder="MM/DD/YYYY" />
      </View>
      <Pressable style={styles.continueBtn} onPress={handleUpdateProfile} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.continueBtnText}>Continue</Text>}
      </Pressable>
      <Pressable style={styles.cancelBtn} onPress={() => setEditing(false)} disabled={loading}>
        <Text style={styles.cancelBtnText}>Cancel</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  avatarEdit: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff0f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarPlaceholderEdit: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff0f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    color: '#888',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 10,
  },
  editBtn: {
    backgroundColor: '#ff3a76',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  editBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  infoSection: {
    marginTop: 30,
    paddingHorizontal: 30,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  infoValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoutSection: {
    marginTop: 40,
    alignItems: 'center',
  },
  logoutBtn: {
    backgroundColor: '#ff3a76',
    borderRadius: 8,
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  logoutBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 24,
  },
  editPhotoBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  editPhotoIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ff3a76',
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  editFormSection: {
    marginTop: 30,
    paddingHorizontal: 30,
  },
  editLabel: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 6,
    marginTop: 12,
  },
  editInput: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 2,
  },
  continueBtn: {
    backgroundColor: '#ff3a76',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 30,
    marginHorizontal: 30,
  },
  continueBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelBtn: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 30,
  },
  cancelBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  optionsCard: {
    backgroundColor: '#18181b',
    borderRadius: 18,
    marginTop: 36,
    marginHorizontal: 20,
    paddingVertical: 8,
    // shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // elevation for Android
    elevation: 2,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#232326',
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 18,
  },
  optionText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  optionChevron: {
    color: '#888',
    fontSize: 22,
    marginLeft: 8,
  },
  logoutRow: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#ff3a76',
    fontWeight: 'bold',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 36,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  backBtn: {
    padding: 8,
    width: 36,
    alignItems: 'flex-start',
  },
  backIcon: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },
});
