import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bgimg from "../../../assets/images/bg.png";
import couplePose from "../../../assets/images/couple_pose_1.png";
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

  // Autofill user data from backend
  useEffect(() => {
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
  }, []);

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
      const age = new Date().getFullYear() - selectedDate.getFullYear();
      setForm({ ...form, dob, age });
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
      navigate("/user/select-template");
    } catch (err) {
      console.error("Profile creation error:", err.response?.status, err.response?.data);
      alert(err.response?.data?.message || err.message || "Profile creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <img src={bgimg} alt="Background" className="w-full h-full object-cover object-center" />
      </div>

      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 py-8 lg:py-0 gap-6 md:gap-8 lg:gap-12">
        {/* Left Image */}
        <div className="hidden md:flex flex-1 items-center justify-center w-full">
          <div className="relative w-full max-w-xs md:max-w-md lg:max-w-lg">
            <img
              src={couplePose}
              alt="Couple"
              className="w-full h-auto object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Right Form */}
        <div className="flex-1 flex items-center justify-center w-full">
          <div
            className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 border border-white/20"
            style={{
              borderRadius: "18px",
              background: "rgba(0, 0, 0, 0.28)",
              boxShadow: "0 4px 31px 0 rgba(0, 0, 0, 0.38)",
              backdropFilter: "blur(48.25px)",
            }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 text-center tracking-wide">
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
                <span className="text-xs text-white font-medium">
                  {step === 1 && "Personal Details"}
                  {step === 2 && "Contact Info"}
                  {step === 3 && "Upload Photo"}
                </span>
              </div>
            </div>

            {/* Step 1: Personal */}
            {step === 1 && (
              <div className="w-full">
                <label className="block text-sm sm:text-base text-white mb-1 font-medium">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  className="w-full border border-white/20 text-white placeholder:text-neutral-400 rounded-lg mb-3 sm:mb-4 text-sm sm:text-base px-3 sm:px-4 md:px-5 outline-none"
                  style={{ background: "rgba(0,0,0,0.28)", height: "3rem" }}
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                />

                <label className="block text-sm sm:text-base text-white mb-1 font-medium">
                  Gender <span className="text-red-400">*</span>
                </label>
                <div
                  className="flex items-center justify-between gap-3 mb-3 sm:mb-4 px-3 sm:px-4"
                  style={{ height: "3rem" }}
                >
                  {genders.map((g) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={form.gender === g}
                          onChange={(e) => setField("gender", e.target.value)}
                          className="w-4 h-4 cursor-pointer appearance-none rounded-full border-2 border-white/40 checked:border-white"
                          style={{ background: form.gender === g ? "white" : "transparent" }}
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
                        className={`text-sm sm:text-base font-medium ${
                          form.gender === g ? "text-white" : "text-neutral-400"
                        }`}
                      >
                        {g}
                      </span>
                    </label>
                  ))}
                </div>

                <label className="block text-sm sm:text-base text-white mb-1 font-medium">
                  Date of Birth <span className="text-red-400">*</span>
                </label>
                <input
                  className="w-full border border-white/20 text-white placeholder:text-neutral-400 rounded-lg mb-3 sm:mb-4 text-sm sm:text-base px-3 sm:px-4 md:px-5 outline-none"
                  style={{ background: "rgba(0,0,0,0.28)", height: "3rem", colorScheme: "dark" }}
                  type="date"
                  value={form.dob}
                  onChange={onDateChange}
                />

                <input
                  className="w-full border border-white/20 text-white placeholder:text-neutral-400 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base px-3 sm:px-4 md:px-5 outline-none"
                  style={{ background: "rgba(0,0,0,0.28)", height: "3rem" }}
                  placeholder="Age"
                  value={form.age?.toString()}
                  readOnly
                />

                <button
                  className="w-full text-white font-bold rounded-lg text-sm sm:text-base py-2 sm:py-2.5 md:py-2.5"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255, 71, 71, 0.63) 0%, rgba(206, 114, 255, 0.63) 28.65%, rgba(157, 209, 255, 0.63) 68.84%, rgba(255, 210, 97, 0.63) 100%)",
                  }}
                  type="button"
                  onClick={() => setStep(2)}
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Contact */}
            {step === 2 && (
              <div className="w-full">
                <label className="block text-sm sm:text-base text-white mb-1 font-medium">
                  Mobile <span className="text-red-400">*</span>
                </label>
                <input
                  className="w-full border border-white/20 text-white placeholder:text-neutral-400 rounded-lg mb-3 sm:mb-4 text-sm sm:text-base px-3 sm:px-4 md:px-5 outline-none"
                  style={{ background: "rgba(0,0,0,0.28)", height: "3rem" }}
                  placeholder="Mobile"
                  value={form.mobile}
                  onChange={(e) => setField("mobile", e.target.value)}
                  type="tel"
                />

                <label className="block text-sm sm:text-base text-white mb-1 font-medium">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  className="w-full border border-white/20 text-white placeholder:text-neutral-400 rounded-lg mb-3 sm:mb-4 text-sm sm:text-base px-3 sm:px-4 md:px-5 outline-none"
                  style={{ background: "rgba(0,0,0,0.28)", height: "3rem" }}
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  type="email"
                />

                <input
                  className="w-full border border-white/20 text-white placeholder:text-neutral-400 rounded-lg mb-3 sm:mb-4 text-sm sm:text-base px-3 sm:px-4 md:px-5 outline-none"
                  style={{ background: "rgba(0,0,0,0.28)", height: "3rem" }}
                  placeholder="Instagram URL"
                  value={form.social_platforms.instagram}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      social_platforms: { ...form.social_platforms, instagram: e.target.value },
                    })
                  }
                />

                <div className="flex gap-3">
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
                      background:
                        "linear-gradient(90deg, rgba(255, 71, 71, 0.63) 0%, rgba(206, 114, 255, 0.63) 28.65%, rgba(157, 209, 255, 0.63) 68.84%, rgba(255, 210, 97, 0.63) 100%)",
                    }}
                    type="button"
                    onClick={() => setStep(3)}
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
                <p className="text-center text-xs sm:text-sm text-neutral-400 mb-6">
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
                      background:
                        "linear-gradient(90deg, rgba(255, 71, 71, 0.63) 0%, rgba(206, 114, 255, 0.63) 28.65%, rgba(157, 209, 255, 0.63) 68.84%, rgba(255, 210, 97, 0.63) 100%)",
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
    </div>
  );
}
