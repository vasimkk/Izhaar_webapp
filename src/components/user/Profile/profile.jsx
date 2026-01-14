import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import couplePose from "../../../assets/images/C.png";
import api from "../../../utils/api";

export default function UserProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Personal, 2: Contact, 3: Photo
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [form, setForm] = useState({
    name: "",
    gender: "",
    dob: "",
    age: "",
    mobile: "",
    email: "",
    social_platforms: { instagram: "" },
    profile_photo: "",
  });

  // Route Guard: Check if profile already exists, if yes redirect to next step
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        // Check if user agreed to terms first
        const agreeRes = await api.get("/user-agreement/status");
        if (!agreeRes.data?.agreed) {
          // Not agreed yet, redirect to welcome
          navigate("/welcome", { replace: true });
          return;
        }

        // Check if profile already exists
        const profileRes = await api.get("/profile/me");
        const profileData = profileRes.data.profile || profileRes.data;
        const hasProfile = profileData && (profileData.id || profileData._id);

        if (hasProfile) {
          // Profile exists, check template selection
          try {
            const templateRes = await api.get("/user/template-history");
            if (templateRes.data && templateRes.data.length > 0) {
              // Template selected, go to dashboard
              navigate("/user/dashboard", { replace: true });
              return;
            } else {
              // No template, go to template selection
              navigate("/user/select-template", { replace: true });
              return;
            }
          } catch {
            // Template check failed, go to template selection
            navigate("/user/select-template", { replace: true });
            return;
          }
        }
        // No profile, stay on profile creation page and fetch user info
      } catch (err) {
        // Profile doesn't exist (404) or other error, stay on page to create profile
        if (err.response?.status === 404) {
          // Profile doesn't exist, continue to creation
        } else {
          console.error("Error checking profile:", err);
        }
      }

      // Fetch user info for autofill
      async function fetchUserInfo() {
        try {
          const res = await api.get("auth/user-info");
          const profileData = res.data;

          if (profileData) {
            setForm((prev) => ({
              ...prev,
              name: profileData.name || "",
              email: profileData.google_email || profileData.email || "",
              mobile: profileData.mobile || "",
              profile_photo: profileData.google_picture || profileData.profile_photo || "",
            }));
          }
        } catch (err) {
          console.error("Failed to fetch user info", err);
        }
      }
      fetchUserInfo();
    };

    checkOnboardingStatus();
  }, [navigate]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Handle date input & age calculation
  const onDateChange = (e) => {
    const value = e.target.value;
    if (!value) {
      setForm({ ...form, dob: "", age: "" });
      return;
    }
    const selectedDate = new Date(value);
    if (!isNaN(selectedDate)) {
      const dob = selectedDate.toISOString().split("T")[0];
      const currentYear = new Date().getFullYear();
      const age = currentYear - selectedDate.getFullYear();
      if (age >= 18) {
        setForm({ ...form, dob, age });
      } else {
        alert("Age must be 18 or older.");
        setForm({ ...form, dob: "", age: "" });
      }
    }
  };

  // Pick & upload profile photo
  const pickProfilePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/profile/photo", formData);
      setField("profile_photo", res.data.profile_photo);
    } catch (err) {
      alert("Photo upload failed");
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Gender options
  const genders = ["Male", "Female", "Other"];

  // Submit profile
  const createProfile = async () => {
    if (!form.name || !form.dob || !form.gender || !form.mobile || !form.email) {
      return alert("Please fill all required fields");
    }

    try {
      setLoading(true);

      const data = {
        name: form.name.trim(),
        age: parseInt(form.age) || 0,
        gender: form.gender,
        mobile: form.mobile.trim(),
        email: form.email.trim(),
        terms_agreed: true,
        nickname: form.nickname?.trim() || null,
        about: null,
        social_platforms: {
          instagram: form.social_platforms.instagram?.trim() || "",
        },
        profile_photo: form.profile_photo || null,
      };

      const res = await api.post("/profile", data);
      console.log("Profile created successfully:", res.data);

      alert("Profile created successfully!");
      // Use replace to prevent going back to profile creation
      navigate("/user/select-template", { replace: true });
    } catch (err) {
      console.error("Profile creation error:", err.response?.status, err.response?.data);
      alert(err.response?.data?.message || err.message || "Profile creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#f5f1f8] via-[#f0e8f8] to-[#e8dff5]">
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)',
          animation: 'gradientShift 15s ease infinite'
        }}
      ></div>

      {/* Heart Animation Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {[...Array(25)].map((_, i) => {
          const colors = [
            { fill: 'rgba(255, 0, 0, 0.7)', stroke: 'rgba(255, 0, 0, 0.5)' },
            { fill: 'rgba(255, 105, 180, 0.7)', stroke: 'rgba(255, 105, 180, 0.5)' },
            { fill: 'rgba(255, 20, 147, 0.7)', stroke: 'rgba(255, 20, 147, 0.5)' },
            { fill: 'rgba(255, 69, 0, 0.7)', stroke: 'rgba(255, 69, 0, 0.5)' },
            { fill: 'rgba(255, 182, 193, 0.7)', stroke: 'rgba(255, 182, 193, 0.5)' },
          ];
          const colorIndex = i % colors.length;
          const color = colors[colorIndex];

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: `${40 + Math.random() * 80}px`,
                height: `${40 + Math.random() * 80}px`,
                opacity: 0.6,
                animation: `continuousFloat ${6 + Math.random() * 8}s linear infinite`,
                animationDelay: `${Math.random() * 3}s`,
                left: `${Math.random() * 100}%`,
                bottom: '-150px'
              }}
            >
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', filter: `drop-shadow(0 4px 8px ${color.stroke})` }}>
                <path
                  d="M50,85 C20,70 5,55 5,40 C5,25 15,15 25,15 C35,15 45,25 50,35 C55,25 65,15 75,15 C85,15 95,25 95,40 C95,55 80,70 50,85 Z"
                  fill={color.fill}
                  stroke={color.stroke}
                  strokeWidth="2"
                />
              </svg>
            </div>
          );
        })}
      </div>

      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 py-8 lg:py-0 gap-6 md:gap-8 lg:gap-12 relative" style={{ zIndex: 1 }}>
        <div className="hidden md:flex flex-1 items-center justify-center w-full">
          <div className="relative w-full max-w-xs md:max-w-md lg:max-w-lg flex items-center justify-center">
            <div
              className="absolute w-96 h-96 rounded-full opacity-15 blur-3xl"
              style={{
                background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                animation: 'pulse 4s ease-in-out infinite, glow 3s ease-in-out infinite'
              }}
            />
            <img
              src={couplePose}
              alt="Couple"
              className="w-full h-auto object-contain drop-shadow-2xl relative z-10"
              style={{
                filter: 'drop-shadow(0 20px 40px rgba(233, 30, 99, 0.2))'
              }}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center w-full">
          <div
            className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 border rounded-3xl backdrop-blur-md"
            style={{
              borderColor: 'rgba(212, 197, 232, 0.3)',
              background: 'rgba(255, 255, 255, 0.6)',
              boxShadow: '0 8px 32px 0 rgba(45, 27, 78, 0.15), inset 0 1px 1px 0 rgba(255, 255, 255, 0.5)',
              animation: 'glow 4s ease-in-out infinite'
            }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D1B4E] mb-6 sm:mb-8 text-center tracking-wide">
              {step === 1 && "Profile Details"}
              {step === 2 && "Contact Information"}
              {step === 3 && "Upload Photo"}
            </h2>

            {/* Stepper */}
            <div className="mb-6 sm:mb-8">
              <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${(step / 3) * 100}%`,
                    background:
                      "linear-gradient(90deg, rgba(255, 71, 71, 0.63) 0%, rgba(206, 114, 255, 0.63) 28.65%, rgba(157, 209, 255, 0.63) 68.84%, rgba(255, 210, 97, 0.63) 100%)",
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-neutral-400">Step {step} of 3</span>
                <span className="text-xs text-[#2D1B4E] font-medium">
                  {step === 1 && "Personal Details"}
                  {step === 2 && "Contact Info"}
                  {step === 3 && "Upload Photo"}
                </span>
              </div>
            </div>

            {/* Step 1: Personal */}
            {step === 1 && (
              <div className="w-full">
                <label className="block text-sm sm:text-base text-[#2D1B4E] mb-1 font-medium">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  className="w-full px-4 sm:px-5 rounded-2xl bg-white/50 backdrop-blur-md text-[#2D1B4E] text-sm sm:text-base border-2 placeholder-[#6B5B8E]/50 focus:outline-none focus:border-[#E91E63]/50 shadow-lg transition-all"
                  style={{
                    height: '3rem',
                    borderColor: 'rgba(212, 197, 232, 0.3)'
                  }}
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                />

                <label className="block text-sm sm:text-base text-[#2D1B4E] mb-1 font-medium">
                  Gender <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4 px-3 sm:px-4" style={{ height: "3rem" }}>
                  {genders.map((g) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={form.gender === g}
                          onChange={(e) => setField("gender", e.target.value)}
                          className="w-4 h-4 cursor-pointer appearance-none rounded-full border-2 border-[#2D1B4E]/40 checked:border-[#E91E63]"
                          style={{ background: form.gender === g ? "#E91E63" : "transparent" }}
                        />
                        {form.gender === g && (
                          <div
                            className="absolute w-2 h-2 rounded-full"
                            style={{
                              background:
                                "linear-gradient(90deg, rgba(255, 71, 71, 0.63) 0%, rgba(206, 114, 255, 0.63) 28.65%, rgba(157, 209, 255, 0.63) 68.84%, rgba(255, 210, 97, 0.63) 100%)",
                            }}
                          />
                        )}
                      </div>
                      <span
                        className={`text-sm sm:text-base font-medium ${form.gender === g ? "text-[#2D1B4E]" : "text-neutral-400"
                          }`}
                      >
                        {g}
                      </span>
                    </label>
                  ))}
                </div>

                <label className="block text-sm sm:text-base text-[#2D1B4E] mb-1 font-medium">
                  Date of Birth <span className="text-red-400">*</span>
                </label>
                <input
                  className="w-full px-4 sm:px-5 rounded-2xl bg-white/50 backdrop-blur-md text-[#2D1B4E] text-sm sm:text-base border-2 placeholder-[#6B5B8E]/50 focus:outline-none focus:border-[#E91E63]/50 shadow-lg transition-all"
                  style={{
                    height: '3rem',
                    borderColor: 'rgba(212, 197, 232, 0.3)'
                  }}
                  type="date"
                  value={form.dob}
                  onChange={onDateChange}
                />
                <label className="block text-sm sm:text-base text-[#2D1B4E] mb-1 font-medium">
                  Age <span className="text-red-400">*</span>
                </label>
                <input
                  className="w-full px-4 py-5 sm:px-5 rounded-2xl bg-white/50 backdrop-blur-md text-[#2D1B4E] text-sm sm:text-base border-2 placeholder-[#6B5B8E]/50 focus:outline-none focus:border-[#E91E63]/50 shadow-lg transition-all "
                  style={{
                    height: '3rem',
                    borderColor: 'rgba(212, 197, 232, 0.3)'
                  }}
                  placeholder="Age"
                  value={form.age?.toString()}
                  readOnly
                />

                <button
                  className="w-full text-white font-bold mt-3 rounded-lg text-sm sm:text-base py-2 sm:py-2.5 md:py-2.5"
                  style={{
                    background: form.name && form.dob && form.gender ? 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)' : 'gray',
                    boxShadow: form.name && form.dob && form.gender ? '0 4px 15px 0 rgba(233, 30, 99, 0.4)' : 'none',
                    animation: form.name && form.dob && form.gender ? 'fadeInUp 1s ease-out 0.6s both' : 'none',
                    cursor: form.name && form.dob && form.gender ? 'pointer' : 'not-allowed',
                    opacity: form.name && form.dob && form.gender ? 1 : 0.6
                  }}
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!form.name || !form.dob || !form.gender}
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Contact */}
            {step === 2 && (
              <div className="w-full">
                <label className="block text-sm sm:text-base text-[#2D1B4E] mb-1 font-medium">
                  Mobile <span className="text-red-400">*</span>
                </label>
                <input
                  className="w-full px-4 sm:px-5 rounded-2xl bg-white/50 backdrop-blur-md text-[#2D1B4E] text-sm sm:text-base border-2 placeholder-[#6B5B8E]/50 focus:outline-none focus:border-[#E91E63]/50 shadow-lg transition-all"
                  style={{
                    height: '3rem',
                    borderColor: 'rgba(212, 197, 232, 0.3)'
                  }}
                  placeholder="Mobile"
                  value={form.mobile}
                  onChange={(e) => setField("mobile", e.target.value)}
                  type="tel"
                />

                <label className="block text-sm sm:text-base text-[#2D1B4E] mb-1 font-medium">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  className="w-full px-4 sm:px-5 rounded-2xl bg-white/50 backdrop-blur-md text-[#2D1B4E] text-sm sm:text-base border-2 placeholder-[#6B5B8E]/50 focus:outline-none focus:border-[#E91E63]/50 shadow-lg transition-all"
                  style={{
                    height: '3rem',
                    borderColor: 'rgba(212, 197, 232, 0.3)'
                  }}
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  type="email"
                />

                <label className="block text-sm sm:text-base text-[#2D1B4E] mb-1 font-medium">
                  Instagram URL
                </label>
                <input
                  className="w-full px-4 sm:px-5 rounded-2xl bg-white/50 backdrop-blur-md text-[#2D1B4E] text-sm sm:text-base border-2 placeholder-[#6B5B8E]/50 focus:outline-none focus:border-[#E91E63]/50 shadow-lg transition-all"
                  style={{
                    height: '3rem',
                    borderColor: 'rgba(212, 197, 232, 0.3)'
                  }}
                  placeholder="Instagram URL"
                  value={form.social_platforms.instagram}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      social_platforms: { ...form.social_platforms, instagram: e.target.value },
                    })
                  }
                />

                <div className="flex gap-3 mt-3">
                  <button
                    className="flex-1 text-white font-bold rounded-lg text-sm sm:text-base py-2 sm:py-2.5 md:py-2.5"
                    style={{ background: "rgba(0,0,0,0.28)", border: "1px solid rgba(255,255,255,0.2)" }}
                    type="button"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </button>
                  <button
                    className="flex-1 text-white font-bold rounded-lg text-sm sm:text-base py-2 sm:py-2.5 md:py-2.5"
                    style={{
                      background: form.mobile && form.email ? 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)' : 'gray',
                      boxShadow: '0 4px 15px 0 rgba(233, 30, 99, 0.4)',
                      animation: 'fadeInUp 1s ease-out 0.6s both'
                    }}
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!form.mobile || !form.email}

                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Photo */}
            {step === 3 && (
              <div className="w-full">
                <div className="flex items-center justify-center mb-6">
                  <label
                    htmlFor="profile-photo-upload"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-white/20 flex items-center justify-center overflow-hidden cursor-pointer"
                    style={{
                      background: "rgba(0,0,0,0.28)",
                      cursor: uploadingPhoto ? "not-allowed" : "pointer",
                    }}
                  >
                    {uploadingPhoto ? (
                      <span className="text-white font-bold text-sm">Uploading...</span>
                    ) : form.profile_photo ? (
                      <img
                        src={form.profile_photo}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-3xl sm:text-4xl">📸</span>
                    )}
                    <input
                      id="profile-photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={pickProfilePhoto}
                      disabled={uploadingPhoto}
                    />
                  </label>
                </div>
                <p className="text-center text-xs sm:text-sm text-black mb-6">
                  ✓ Your photo is safe and secure
                </p>
                <div className="flex gap-3">
                  <button
                    className="flex-1 text-white font-bold rounded-lg text-sm sm:text-base py-2 sm:py-2.5 md:py-2.5"
                    style={{ background: "rgba(0,0,0,0.28)", border: "1px solid rgba(255,255,255,0.2)" }}
                    type="button"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </button>
                  <button
                    className="flex-1 text-white font-bold rounded-lg text-sm sm:text-base py-2 sm:py-2.5 md:py-2.5"
                    style={{
                      background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                      boxShadow: '0 4px 15px 0 rgba(233, 30, 99, 0.4)',
                      animation: 'fadeInUp 1s ease-out 0.6s both'
                    }}
                    type="button"
                    onClick={createProfile}
                    disabled={uploadingPhoto || loading}
                  >
                    {loading ? "Creating..." : uploadingPhoto ? "Uploading..." : "Finish"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes continuousFloat {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg) scale(0.8);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          50% {
            transform: translateY(-50vh) translateX(30px) rotate(180deg) scale(1);
            opacity: 0.5;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-120vh) translateX(-20px) rotate(360deg) scale(0.7);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
