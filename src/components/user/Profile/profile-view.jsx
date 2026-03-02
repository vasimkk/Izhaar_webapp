import api from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import Logout from "../../../assets/icons/logout.png"
import contact_us from "../../../assets/icons/contactUs.png"
import security from "../../../assets/icons/Security.png"
import Privacy from "../../../assets/icons/Privacy.png"
import tracker from "../../../assets/icons/Tracker.png"

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
      const res = await api.put(`/profile/${profileData.id}`, payload);
      const updatedProfile = res.data.profile || res.data;
      setProfileData(updatedProfile);
      setEditing(false);

      // Update global auth state directly for instant header/bottom bar updates
      if (auth.setUser) {
        auth.setUser(prev => ({ ...prev, ...updatedProfile }));
      }

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
        navigate('/', { replace: true });
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

  const AnimationBackground = () => (
    <>
      {/* Background Gradient */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: '#000'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.15) 0%, transparent 50%)',
            animation: 'float 20s ease-in-out infinite'
          }}
        />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 10px rgba(233, 30, 99, 0), 0 0 20px rgba(156, 39, 176, 0); }
          50% { text-shadow: 0 0 10px rgba(233, 30, 99, 0.5), 0 0 20px rgba(156, 39, 176, 0.3); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(236, 72, 145, 0.3);
          border-radius: 10px;
        }
      `}</style>
    </>
  );

  if (loading && !profileData) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #050505 0%, #1a103c 50%, #2e022d 100%)' }}>
        <AnimationBackground />
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4 relative z-10"></div>
        <div className="text-lg text-white relative z-10">Loading profile...</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #050505 0%, #1a103c 50%, #2e022d 100%)' }}>
        <AnimationBackground />
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-2xl font-bold text-white mb-2">No Profile Found</div>
          <div className="text-gray-300 mb-6">Create one to get started</div>
          <button className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg px-6 py-2 font-semibold transition-all" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  // View mode
  if (!editing) {
    return (
      <div className="min-h-screen w-full overflow-hidden relative" style={{
        background: 'linear-gradient(135deg, #050505 0%, #1a103c 50%, #2e022d 100%)',
        backgroundAttachment: 'fixed'
      }}>
        <AnimationBackground />

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center px-4 sm:px-6 md:px-8 py-8 sm:py-10">
          {/* Mobile Back Button */}
          <button
            onClick={() => navigate("/user/dashboard")}
            className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95 bg-white/10 border border-white/20 text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Header */}
          <div className="w-full flex flex-col items-center mb-6 sm:mb-8">
            <h4
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#EC4891] to-[#A928ED] tracking-tight drop-shadow-sm"
              style={{
                fontFamily: "'Playfair Display', serif",
                animation: 'textGlow 3s ease-in-out infinite'
              }}
            >
              Profile
            </h4>
            <div className="mt-3 h-px w-full max-w-5xl bg-white/10" />
          </div>

          <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">
            {/* Profile Card */}
            <div className="w-full md:w-1/2 rounded-3xl p-6 sm:p-8 md:p-10 bg-black/40 backdrop-blur-3xl border border-white/10 shadow-[0_40px_100px_rgba(236,72,153,0.3)] relative overflow-hidden group transition-all duration-500">
              {/* Soft Romantic Gradients */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-600/10 blur-[60px] rounded-full" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-600/10 blur-[60px] rounded-full" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Profile Photo */}
              <div className="flex justify-center mb-6 relative z-10">
                {profileData.profile_photo ? (
                  <img
                    src={profileData.profile_photo}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-pink-400/50 shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 flex items-center justify-center border-4 border-pink-400/50 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                    <span className="text-6xl">👤</span>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="text-center mb-8 relative z-10">
                <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-sm" style={{ fontFamily: "'Playfair Display', serif" }}>{profileData.name}</h2>
                <p className="text-[#D1D5DC] text-lg font-medium">{profileData.email}</p>
                <p className="text-[#D1D5DC] text-sm opacity-80 mt-1 font-medium">{profileData.mobile || "No mobile number"}</p>
                <div className="flex justify-center gap-4 mt-4">
                  <span className="bg-white/5 px-4 py-1.5 rounded-full border border-white/10 text-gray-300 text-sm font-semibold">{profileData.gender || 'N/A'}</span>
                  <span className="bg-white/5 px-4 py-1.5 rounded-full border border-white/10 text-gray-300 text-sm font-semibold">{profileData.age ? `${profileData.age} years` : 'N/A'}</span>
                </div>
              </div>

              {/* Edit Button */}
              <button
                className="w-full h-[48px] bg-gradient-to-r from-[#EC4891] to-[#A928ED] hover:scale-[1.02] active:scale-[0.98] text-white font-semibold rounded-2xl shadow-lg shadow-pink-500/20 flex items-center justify-center transition-all text-base border border-white/20 relative z-10"
                onClick={() => setEditing(true)}
              >
                ✏️ Edit Profile
              </button>
            </div>

            {/* Options Card */}
            <div className="w-full md:w-1/2 rounded-3xl bg-black/40 backdrop-blur-3xl border border-white/10 shadow-[0_40px_100px_rgba(236,72,153,0.3)] overflow-hidden flex flex-col justify-center transition-all duration-500">
              {[
                { label: 'Izhaar Tracker', icon: tracker, path: '/user/izhaar_tracker' },
                { label: 'Privacy Policy', icon: Privacy, path: '/user/Profile/privacy-policy' },
                { label: 'Security & Permissions', icon: security, path: '/user/security' },
                { label: 'Contact Us', icon: contact_us, path: '/user/contact-us' },
              ].map((item, index) => (
                <button
                  key={index}
                  className="w-full flex items-center px-6 py-5 hover:bg-white/5 transition-all border-b border-white/5 last:border-0 group"
                  onClick={() => navigate(item.path)}
                >
                  <div className="w-10 h-10 mr-4 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <img src={item.icon} alt={item.label} className="w-5 h-5 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="flex-1 text-base font-semibold text-gray-300 group-hover:text-white transition-colors">{item.label}</span>
                  <span className="text-lg text-gray-500 group-hover:text-pink-400 group-hover:translate-x-1 transition-all">›</span>
                </button>
              ))}

              <button
                className="w-full flex items-center px-6 py-5 hover:bg-red-500/10 transition-all group mt-auto border-t border-white/5"
                onClick={handleLogout}
                disabled={deleting}
              >
                <div className="w-10 h-10 mr-4 rounded-full bg-red-500/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <img src={Logout} alt="Logout" className="w-5 h-5 object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="flex-1 text-base font-semibold text-red-400 group-hover:text-red-300 text-left">Log out</span>
                {deleting ? (
                  <span className="animate-spin h-5 w-5 border-b-2 border-red-400 rounded-full"></span>
                ) : (
                  <span className="text-lg text-red-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all">›</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Edit mode
  return (
    <div className="min-h-screen w-full overflow-hidden relative" style={{
      background: 'linear-gradient(135deg, #050505 0%, #1a103c 50%, #2e022d 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <AnimationBackground />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 sm:px-6 md:px-8 py-8 sm:py-10">
        {/* Mobile Back Button */}
        <div className="w-full relative z-10 pt-2 md:pt-4">
          <button
            onClick={() => setEditing(false)}
            className="inline-flex items-center gap-2 text-white hover:text-pink-400 transition mb-6 text-sm md:text-base font-medium md:hidden"
          >
            <span className="text-xl">←</span>
            <span>Back</span>
          </button>
        </div>

        {/* Header */}
        <div className="w-full flex justify-center mb-8">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#EC4891] to-[#A928ED] drop-shadow-sm"
            style={{
              fontFamily: "'Playfair Display', serif",
              animation: 'textGlow 3s ease-in-out infinite'
            }}
          >
            Edit Profile
          </h1>
        </div>

        {/* Edit Card */}
        <form
          className="w-full max-w-md bg-black/40 backdrop-blur-3xl rounded-3xl p-6 sm:p-8 md:p-10 border border-white/10 shadow-[0_40px_100px_rgba(236,72,153,0.3)] relative overflow-hidden transition-all duration-500"
          onSubmit={handleUpdateProfile}
          autoComplete="off"
        >
          {/* Soft Romantic Gradients */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-pink-600/10 blur-[100px] rounded-full"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-600/10 blur-[100px] rounded-full"></div>

          {/* Profile Photo Section */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              {editForm.profile_photo ? (
                <img
                  src={editForm.profile_photo}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-pink-400/50 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 flex items-center justify-center border-4 border-pink-400/50 text-white">
                  <span className="text-6xl">👤</span>
                </div>
              )}
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-pink-600 hover:bg-pink-500 rounded-full p-2 border-2 border-white transition-transform hover:scale-110 shadow-lg"
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

          {/* Form Fields */}
          <div className="space-y-5 mb-8">

            {/* Name */}
            <div>
              <label className="block text-purple-200 text-sm font-semibold mb-2">👤 Full Name</label>
              <input
                className="w-full bg-white/5 text-white rounded-2xl px-5 py-3.5 border border-white/10 focus:border-pink-500/50 outline-none transition-all text-sm sm:text-base placeholder-gray-500 shadow-lg backdrop-blur-md"
                value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                required
                placeholder="Enter your name"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-purple-200 text-sm font-semibold mb-2">📱 Phone Number</label>
              <input
                className="w-full bg-white/5 text-white rounded-2xl px-5 py-3.5 border border-white/10 focus:border-pink-500/50 outline-none transition-all text-sm sm:text-base placeholder-gray-500 shadow-lg backdrop-blur-md"
                value={editForm.mobile}
                onChange={e => setEditForm({ ...editForm, mobile: e.target.value })}
                type="tel"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-purple-200 text-sm font-semibold mb-2">⚧️ Gender</label>
              <select
                className="w-full bg-white/5 text-white rounded-2xl px-5 py-3.5 border border-white/10 focus:border-pink-500/50 outline-none transition-all text-sm sm:text-base [&>option]:text-black shadow-lg backdrop-blur-md appearance-none"
                value={editForm.gender}
                onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Age */}
            <div>
              <label className="block text-purple-200 text-sm font-semibold mb-2">🎂 Age</label>
              <input
                className="w-full bg-white/5 text-white rounded-2xl px-5 py-3.5 border border-white/10 focus:border-pink-500/50 outline-none transition-all text-sm sm:text-base placeholder-gray-500 shadow-lg backdrop-blur-md"
                value={editForm.age}
                onChange={e => setEditForm({ ...editForm, age: e.target.value })}
                type="number"
                placeholder="Enter your age"
                min="1"
                max="120"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className={`w-full h-[48px] bg-gradient-to-r from-[#EC4891] to-[#A928ED] hover:scale-[1.02] active:scale-[0.98] text-white font-semibold rounded-2xl shadow-lg shadow-pink-500/20 flex items-center justify-center transition-all text-base border border-white/20 relative z-10 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin h-5 w-5 border-b-2 border-white rounded-full mr-2"></span>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
            <button
              type="button"
              className="w-full h-[48px] bg-white/5 hover:bg-white/10 text-white font-semibold rounded-2xl transition-all border border-white/10 shadow-lg backdrop-blur-md"
              onClick={() => setEditing(false)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
