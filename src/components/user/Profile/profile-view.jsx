import api from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";

export default function ProfileView() {
  const navigate = useNavigate();
  const auth = useAuth();
  const fileInputRef = useRef();

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
        navigate(LOGIN, { replace: true });
      } else {
        alert("Could not load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
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
      alert("Profile updated!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };


  // Log out logic (from user)
  const handleLogout = async () => {
    try {
      try {
        await api.post("/auth/logout");
      } catch (err) {
        // ignore
      }
      await auth.clearAuth();
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 100);
    } catch (e) {
      // ignore
    }
  };

  // Pick profile photo (web)
  const pickProfilePhoto = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm((prev) => ({ ...prev, profile_photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading && !profileData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
        <div className="text-lg text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white px-4">
        <div className="text-2xl font-bold text-gray-900 mb-2">No Profile Found</div>
        <div className="text-gray-500 mb-6">Create one to get started</div>
        <button className="bg-pink-500 text-white rounded px-6 py-2 font-semibold" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  // View mode (Figma style)
  if (!editing) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="flex flex-row items-center justify-between pt-10 px-2 mb-2">
         
          <div className="text-2xl font-bold flex-1 text-center">Profile</div>
          <div className="w-9" />
        </div>
        <div className="flex flex-col items-center mt-4">
          {profileData.profile_photo ? (
            <img src={profileData.profile_photo} alt="Profile" className="w-24 h-24 rounded-full mb-3 object-cover border-2 border-pink-400" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-pink-50 flex items-center justify-center mb-3">
              <span className="text-4xl text-gray-400">👤</span>
            </div>
          )}
          <div className="text-xl font-bold mb-1">{profileData.name}</div>
          <div className="text-sm text-gray-300 mb-3">{profileData.email}</div>
          <button className="bg-pink-500 rounded px-5 py-2 font-bold text-white mb-6" onClick={() => setEditing(true)}>
            Edit profile
          </button>
        </div>
        {/* Options Card */}
        <div className="bg-zinc-900 rounded-2xl mt-8 mx-5 py-2 shadow-md">
          <button className="flex flex-row items-center w-full px-5 py-4 border-b border-zinc-800 hover:bg-zinc-800 transition" onClick={() => navigate('/user/IzhaarTracker/izhaar-tracker')}>
            <span className="text-xl mr-4">📄</span>
            <span className="flex-1 text-base font-semibold">Izhaar Tracker</span>
            <span className="text-lg text-gray-400 ml-2">›</span>
          </button>
          <button className="flex flex-row items-center w-full px-5 py-4 border-b border-zinc-800 hover:bg-zinc-800 transition" onClick={() => navigate('/user/Profile/privacy-policy')}>
            <span className="text-xl mr-4">🔒</span>
            <span className="flex-1 text-base font-semibold">Privacy Policy</span>
            <span className="text-lg text-gray-400 ml-2">›</span>
          </button>
          <button className="flex flex-row items-center w-full px-5 py-4 hover:bg-zinc-800 transition" onClick={handleLogout} disabled={deleting}>
            <span className="text-xl mr-4 text-pink-500">🚪</span>
            <span className="flex-1 text-base font-semibold text-pink-500">Log out</span>
            {deleting ? (
              <span className="animate-spin h-5 w-5 border-b-2 border-pink-500 rounded-full ml-2"></span>
            ) : (
              <span className="text-lg text-pink-500 ml-2">›</span>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Edit mode (Figma style)
  return (
    <form className="min-h-screen bg-black text-white pb-10" onSubmit={handleUpdateProfile} autoComplete="off">
      <div className="flex flex-col items-center mt-16">
        <div className="relative mb-2">
          {editForm.profile_photo ? (
            <img src={editForm.profile_photo} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center">
              <span className="text-3xl text-gray-400">👤</span>
            </div>
          )}
          <button
            type="button"
            className="absolute bottom-0 right-0 bg-pink-500 rounded-full p-1 border-2 border-white"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            tabIndex={-1}
          >
            <span className="text-white text-lg">📷</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={pickProfilePhoto}
          />
        </div>
      </div>
      <div className="max-w-md mx-auto mt-8 px-4">
        <label className="block text-gray-400 mb-1 mt-4">Name</label>
        <input
          className="w-full bg-zinc-800 text-white rounded px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={editForm.name}
          onChange={e => setEditForm({ ...editForm, name: e.target.value })}
          required
        />
        <label className="block text-gray-400 mb-1 mt-4">Phone Number</label>
        <input
          className="w-full bg-zinc-800 text-white rounded px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={editForm.mobile}
          onChange={e => setEditForm({ ...editForm, mobile: e.target.value })}
          type="tel"
        />
        <label className="block text-gray-400 mb-1 mt-4">Gender</label>
        <input
          className="w-full bg-zinc-800 text-white rounded px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={editForm.gender}
          onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
          placeholder="Select gender"
        />
        <label className="block text-gray-400 mb-1 mt-4">Age</label>
        <input
          className="w-full bg-zinc-800 text-white rounded px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={editForm.age}
          onChange={e => setEditForm({ ...editForm, age: e.target.value })}
          type="number"
        />
      </div>
      <div className="max-w-md mx-auto flex flex-col gap-4 mt-8 px-4">
        <button
          type="submit"
          className="bg-pink-500 rounded py-3 font-bold text-white disabled:opacity-60"
          disabled={loading}
        >
          {loading ? <span className="animate-spin h-5 w-5 border-b-2 border-white rounded-full inline-block"></span> : 'Continue'}
        </button>
        <button
          type="button"
          className="bg-zinc-700 rounded py-3 font-bold text-white"
          onClick={() => setEditing(false)}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}


