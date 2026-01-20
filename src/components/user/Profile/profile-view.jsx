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
      const res = await api.put(`/profile/${profileData.id}`, payload);
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

  if (loading && !profileData) {
    return (
      <div className="min-h-screen w-full overflow-hidden relative">
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
          <div className="text-lg text-gray-300">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen w-full overflow-hidden relative">

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          <div className="text-2xl font-bold text-white mb-2">No Profile Found</div>
          <div className="text-gray-300 mb-6">Create one to get started</div>
          <button className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg px-6 py-2 font-semibold transition-all" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  // View mode (Figma style)
  if (!editing) {
    return (
      <div className="min-h-screen w-full overflow-hidden relative " style={{
          background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)',
          animation: 'gradientShift 15s ease infinite'
        }}>
        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center px-4 sm:px-6 md:px-8 py-8 sm:py-10">
          {/* Mobile Back Button */}
          <div className="w-full relative z-10 pt-2 md:pt-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-[#2D1B4E] hover:text-pink-600 transition mb-6 text-sm md:text-base font-medium md:hidden"
            >
              <span className="text-xl">←</span>
              <span>Back</span>
            </button>
          </div>
          {/* Header */}
          <div className="w-full flex flex-col items-center mb-6 sm:mb-8">
            <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2D1B4E] tracking-tight">Profile</h4>
            <div className="mt-3 h-px w-full max-w-5xl bg-purple-200/30" />
          </div>

          <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">
            {/* Profile Card */}
            <div className="w-full md:w-1/2 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-lg border border-purple-200/30"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 240, 255, 0.95) 100%)'
              }}>
              {/* Profile Photo */}
              <div className="flex justify-center mb-6">
                {profileData.profile_photo ? (
                  <img 
                    src={profileData.profile_photo} 
                    alt="Profile" 
                    className="w-28 h-28 rounded-full object-cover border-4  shadow-lg" 
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 flex items-center justify-center border-4 border-pink-400/50">
                    <span className="text-6xl">👤</span>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#2D1B4E] mb-2">{profileData.name}</h2>
                <p className="text-[#6B5B8E] text-sm sm:text-base">{profileData.email}</p>
               
              </div>
              {/* Edit Button */}
              <button 
                className={`w-full rounded-xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-2.5 font-semibold text-xs sm:text-sm md:text-base mb-3 sm:mb-4 md:mb-5 transition-all shadow-lg text-white ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'}`}
                style={{
                background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                boxShadow: '0 4px 15px 0 rgba(233, 30, 99, 0.4)',
                animation: 'fadeInUp 1s ease-out 0.6s both'
              }}
                onClick={() => setEditing(true)}
              >
                ✏️ Edit Profile
              </button>
            </div>

            {/* Options Card */}
            <div className="w-full md:w-1/2 rounded-3xl shadow-2xl backdrop-blur-lg border border-purple-200/30 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 245, 255, 0.95) 100%)'
              }}>
              <button 
                className="w-full flex items-center px-6 py-4 hover:bg-purple-100/50 transition border-b border-purple-200/30"
                onClick={() => navigate('/user/izhaar_tracker')}
              >
                <span className="text-2xl mr-4">📄</span>
                <span className="flex-1 text-base font-semibold text-[#2D1B4E]">Izhaar Tracker</span>
                <span className="text-lg text-[#6B5B8E]">›</span>
              </button>

              <button 
                className="w-full flex items-center px-6 py-4 hover:bg-purple-100/50 transition border-b border-purple-200/30"
                onClick={() => navigate('/user/Profile/privacy-policy')}
              >
                <span className="text-2xl mr-4">🔒</span>
                <span className="flex-1 text-base font-semibold text-[#2D1B4E]">Privacy Policy</span>
                <span className="text-lg text-[#6B5B8E]">›</span>
              </button>

              <button 
                className="w-full flex items-center px-6 py-4 hover:bg-purple-100/50 transition border-b border-purple-200/30"
                onClick={() => navigate('/user/security')}
              >
                <span className="text-2xl mr-4">🛡️</span>
                <span className="flex-1 text-base font-semibold text-[#2D1B4E]">Security & Permissions</span>
                <span className="text-lg text-[#6B5B8E]">›</span>
              </button>

              <button 
                className="w-full flex items-center px-6 py-4 hover:bg-purple-100/50 transition border-b border-purple-200/30"
                onClick={() => navigate('/user/contact-us')}
              >
                <span className="text-2xl mr-4">📞</span>
                <span className="flex-1 text-base font-semibold text-[#2D1B4E]">Contact Us</span>
                <span className="text-lg text-[#6B5B8E]">›</span>
              </button>

              <button 
                className="w-full flex items-center px-6 py-4 hover:bg-red-500/20 transition disabled:opacity-60"
                onClick={handleLogout} 
                disabled={deleting}
              >
                <span className="text-2xl mr-4">🚪</span>
                <span className="flex-1 text-base font-semibold text-red-400">Log out</span>
                {deleting ? (
                  <span className="animate-spin h-5 w-5 border-b-2 border-red-400 rounded-full"></span>
                ) : (
                  <span className="text-lg text-red-400">›</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Edit mode (Figma style)
  return (
    <div className="min-h-screen w-full overflow-hidden relative" style={{
      background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)',
      animation: 'gradientShift 15s ease infinite'
    }}>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 sm:px-6 md:px-8 py-8 sm:py-10">
        {/* Mobile Back Button */}
        <div className="w-full relative z-10 pt-2 md:pt-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-[#2D1B4E] hover:text-pink-600 transition mb-6 text-sm md:text-base font-medium md:hidden"
          >
            <span className="text-xl">←</span>
            <span>Back</span>
          </button>
        </div>
        
        {/* Header */}
        <div className="w-full flex justify-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D1B4E]">✏️ Edit Profile</h1>
        </div>

        {/* Edit Card */}
        <form 
          className="w-full max-w-md rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-lg border border-purple-200/30"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 240, 255, 0.95) 100%)'
          }}
          onSubmit={handleUpdateProfile} 
          autoComplete="off"
        >
          
          {/* Profile Photo Section */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              {editForm.profile_photo ? (
                <img 
                  src={editForm.profile_photo} 
                  alt="Profile" 
                  className="w-28 h-28 rounded-full object-cover border-4 border-pink-400 shadow-lg" 
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 flex items-center justify-center border-4 border-pink-400/50">
                  <span className="text-6xl">👤</span>
                </div>
              )}
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-2 border-2 border-white hover:opacity-90 transition"
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
          <div className="space-y-4 mb-8">
            
            {/* Name */}
            <div>
              <label className="block text-[#2D1B4E] text-sm font-semibold mb-2">👤 Full Name</label>
              <input
                className="w-full bg-white text-[#2D1B4E] rounded-lg px-4 py-3 border-2 border-purple-200 focus:border-purple-500 outline-none transition-all text-sm sm:text-base"
                value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                required
                placeholder="Enter your name"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[#2D1B4E] text-sm font-semibold mb-2">📱 Phone Number</label>
              <input
                className="w-full bg-white text-[#2D1B4E] rounded-lg px-4 py-3 border-2 border-purple-200 focus:border-purple-500 outline-none transition-all text-sm sm:text-base"
                value={editForm.mobile}
                onChange={e => setEditForm({ ...editForm, mobile: e.target.value })}
                type="tel"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-[#2D1B4E] text-sm font-semibold mb-2">⚧️ Gender</label>
              <select
                className="w-full bg-white text-[#2D1B4E] rounded-lg px-4 py-3 border-2 border-purple-200 focus:border-purple-500 outline-none transition-all text-sm sm:text-base"
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
              <label className="block text-[#2D1B4E] text-sm font-semibold mb-2">🎂 Age</label>
              <input
                className="w-full bg-white text-[#2D1B4E] rounded-lg px-4 py-3 border-2 border-purple-200 focus:border-purple-500 outline-none transition-all text-sm sm:text-base"
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
              className={`w-full rounded-xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-2.5 font-semibold text-xs sm:text-sm md:text-base mb-3 sm:mb-4 md:mb-5 transition-all shadow-lg text-white ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'}`}
              style={{
                background: 'linear-gradient(90deg, rgba(255, 71, 71, 0.63) 0%, rgba(206, 114, 255, 0.63) 28.65%, rgba(157, 209, 255, 0.63) 68.84%, rgba(255, 210, 97, 0.63) 100%)'
              }}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin h-5 w-5 border-b-2 border-white rounded-full mr-2"></span>
                  Saving...
                </span>
              ) : (
                '💾 Save Changes'
              )}
            </button>
            <button
              type="button"
              className="w-full bg-purple-100 hover:bg-purple-200 text-[#2D1B4E] rounded-lg px-4 py-3 font-bold text-sm sm:text-base transition-all border-2 border-purple-300 disabled:opacity-60"
              onClick={() => setEditing(false)}
              disabled={loading}
            >
              ✕ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

