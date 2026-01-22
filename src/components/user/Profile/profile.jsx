import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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

  // Validation error states
  const [nameError, setNameError] = useState("");
  const [dobError, setDobError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [emailError, setEmailError] = useState("");

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
            // Log the profile data to check if the email field is present
            console.log("Profile data fetched from backend:", profileData);
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

  // Validation functions
  const validateName = (value) => {
    const trimmedName = value.trim();
    if (!trimmedName) return "Name is required";
    if (trimmedName.length < 2) return "Name must be at least 2 characters";
    if (trimmedName.length > 50) return "Name must be less than 50 characters";
    if (!/^[a-zA-Z\s'-]+$/.test(trimmedName)) return "Only letters, spaces, hyphens, and apostrophes allowed";
    if (/\s{2,}/.test(trimmedName)) return "Cannot contain multiple consecutive spaces";
    return "";
  };

  const validateMobile = (value) => {
    if (!value) return "Mobile number is required";
    if (value.length !== 10) return "Mobile number must be 10 digits";
    if (!/^[6-9]\d{9}$/.test(value)) return "Invalid mobile number";
    return "";
  };

  const validateEmail = (value) => {
    const trimmedEmail = value.trim();
    if (!trimmedEmail) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) return "Please enter a valid email address";
    return "";
  };

  const validateDob = (value) => {
    if (!value) return "Date of birth is required";
    const selectedDate = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - selectedDate.getFullYear();
    const monthDiff = today.getMonth() - selectedDate.getMonth();
    const dayDiff = today.getDate() - selectedDate.getDate();
    
    const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
    
    if (actualAge < 18) return "You must be at least 18 years old";
    if (actualAge > 100) return "Please enter a valid date of birth";
    return "";
  };

  // Real-time validation handlers
  const handleNameChange = (value) => {
    setField("name", value);
    if (value.length > 0) {
      setNameError(validateName(value));
    } else {
      setNameError("");
    }
  };

  const handleMobileChange = (value) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 10) {
      setField("mobile", numericValue);
      if (numericValue.length > 0) {
        setMobileError(validateMobile(numericValue));
      } else {
        setMobileError("");
      }
    }
  };

  const handleEmailChange = (value) => {
    setField("email", value);
    if (value.length > 0) {
      setEmailError(validateEmail(value));
    } else {
      setEmailError("");
    }
  };

  // Date picker state
  const [selectedDate, setSelectedDate] = useState(null);

  // Handle date selection from DatePicker
  const handleDatePickerChange = (date) => {
    if (!date) {
      setSelectedDate(null);
      setForm({ ...form, dob: "", age: "" });
      setDobError("");
      return;
    }

    setSelectedDate(date);
    
    // Create date string in YYYY-MM-DD format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dob = `${year}-${month}-${day}`;
    
    // Calculate age
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    const dayDiff = today.getDate() - date.getDate();
    const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
    
    setForm({ ...form, dob, age: actualAge });
    
    // Validate the selected date
    const error = validateDob(dob);
    setDobError(error);
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
      toast.success("Photo uploaded successfully!");
    } catch (err) {
      toast.error("Photo upload failed");
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Gender options
  const genders = ["Male", "Female", "Other"];

  // Submit profile
  const createProfile = async () => {
    if (!form.name || !form.dob || !form.gender || !form.mobile || !form.email) {
      return toast.warning("Please fill all required fields");
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

      toast.success("Profile created successfully!");
      // Use replace to prevent going back to profile creation
      setTimeout(() => {
        navigate("/user/select-template", { replace: true });
      }, 1500);
    } catch (err) {
      console.error("Profile creation error:", err.response?.status, err.response?.data);
      toast.error(err.response?.data?.message || err.message || "Profile creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
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
                  className={`w-full px-4 sm:px-5 rounded-2xl bg-white/50 backdrop-blur-md text-[#2D1B4E] text-sm sm:text-base border-2 placeholder-[#6B5B8E]/50 focus:outline-none shadow-lg transition-all ${
                    nameError ? 'border-red-500 focus:border-red-500' : 'focus:border-[#E91E63]/50'
                  }`}
                  style={{
                    height: '3rem',
                    borderColor: nameError ? '' : 'rgba(212, 197, 232, 0.3)'
                  }}
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
                {nameError && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{nameError}</p>
                )}
                {!nameError && form.name && (
                  <div className="mb-1"></div>
                )}

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
                <div className="relative w-full mb-1">
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDatePickerChange}
                    dateFormat="MMMM d, yyyy"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    yearDropdownItemNumber={15}
                    scrollableYearDropdown
                    maxDate={new Date()}
                    minDate={new Date(1900, 0, 1)}
                    placeholderText="Select your date of birth"
                    className={`w-full pl-12 pr-4 sm:pr-5 rounded-2xl bg-white/50 backdrop-blur-md text-[#2D1B4E] text-sm sm:text-base border-2 placeholder-[#6B5B8E]/50 focus:outline-none shadow-lg transition-all ${
                      dobError ? 'border-red-500 focus:border-red-500' : 'focus:border-[#E91E63]/50'
                    }`}
                    wrapperClassName="w-full"
                    calendarClassName="custom-calendar"
                    style={{
                      height: '3rem',
                      borderColor: dobError ? '' : 'rgba(212, 197, 232, 0.3)'
                    }}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg 
                      className="w-5 h-5 text-[#E91E63]" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    </svg>
                  </div>
                </div>
                {dobError && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{dobError}</p>
                )}
                {!dobError && form.dob && (
                  <div className="mb-1"></div>
                )}

                <label className="block text-sm sm:text-base text-[#2D1B4E] mb-1 font-medium">
                  Age <span className="text-red-400">*</span>
                </label>
                <input
                  className="w-full px-4 sm:px-5 rounded-2xl bg-white/50 backdrop-blur-md text-[#2D1B4E] text-sm sm:text-base border-2 placeholder-[#6B5B8E]/50 focus:outline-none focus:border-[#E91E63]/50 shadow-lg transition-all"
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
                    background: (form.name && form.dob && form.gender && !nameError && !dobError) ? 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)' : 'gray',
                    boxShadow: (form.name && form.dob && form.gender && !nameError && !dobError) ? '0 4px 15px 0 rgba(233, 30, 99, 0.4)' : 'none',
                    animation: (form.name && form.dob && form.gender && !nameError && !dobError) ? 'fadeInUp 1s ease-out 0.6s both' : 'none',
                    cursor: (form.name && form.dob && form.gender && !nameError && !dobError) ? 'pointer' : 'not-allowed',
                    opacity: (form.name && form.dob && form.gender && !nameError && !dobError) ? 1 : 0.6
                  }}
                  type="button"
                  onClick={() => {
                    const nameErr = validateName(form.name);
                    const dobErr = validateDob(form.dob);
                    setNameError(nameErr);
                    setDobError(dobErr);
                    if (!nameErr && !dobErr && form.gender) {
                      setStep(2);
                    }
                  }}
                  disabled={!form.name || !form.dob || !form.gender || !!nameError || !!dobError}
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
                  className={`w-full px-4 sm:px-5 rounded-2xl bg-white/50 backdrop-blur-md text-[#2D1B4E] text-sm sm:text-base border-2 placeholder-[#6B5B8E]/50 focus:outline-none shadow-lg transition-all ${
                    mobileError ? 'border-red-500 focus:border-red-500' : 'focus:border-[#E91E63]/50'
                  }`}
                  style={{
                    height: '3rem',
                    borderColor: mobileError ? '' : 'rgba(212, 197, 232, 0.3)'
                  }}
                  placeholder="10-digit mobile number"
                  value={form.mobile}
                  onChange={(e) => handleMobileChange(e.target.value)}
                  type="tel"
                  maxLength={10}
                />
                {mobileError && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{mobileError}</p>
                )}
                {!mobileError && form.mobile && (
                  <div className="mb-1"></div>
                )}

                <label className="block text-sm sm:text-base text-[#2D1B4E] mb-1 font-medium">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  className={`w-full px-4 sm:px-5 rounded-2xl bg-white/50 backdrop-blur-md text-[#2D1B4E] text-sm sm:text-base border-2 placeholder-[#6B5B8E]/50 focus:outline-none shadow-lg transition-all ${
                    emailError ? 'border-red-500 focus:border-red-500' : 'focus:border-[#E91E63]/50'
                  }`}
                  style={{
                    height: '3rem',
                    borderColor: emailError ? '' : 'rgba(212, 197, 232, 0.3)'
                  }}
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  type="email"
                />
                {emailError && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{emailError}</p>
                )}
                {!emailError && form.email && (
                  <div className="mb-1"></div>
                )}

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
                      background: (form.mobile && form.email && !mobileError && !emailError) ? 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)' : 'gray',
                      boxShadow: (form.mobile && form.email && !mobileError && !emailError) ? '0 4px 15px 0 rgba(233, 30, 99, 0.4)' : 'none',
                      animation: (form.mobile && form.email && !mobileError && !emailError) ? 'fadeInUp 1s ease-out 0.6s both' : 'none',
                      cursor: (form.mobile && form.email && !mobileError && !emailError) ? 'pointer' : 'not-allowed',
                      opacity: (form.mobile && form.email && !mobileError && !emailError) ? 1 : 0.6
                    }}
                    type="button"
                    onClick={() => {
                      const mobileErr = validateMobile(form.mobile);
                      const emailErr = validateEmail(form.email);
                      setMobileError(mobileErr);
                      setEmailError(emailErr);
                      if (!mobileErr && !emailErr) {
                        setStep(3);
                      }
                    }}
                    disabled={!form.mobile || !form.email || !!mobileError || !!emailError}
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
    10% { opacity: 0.6; }
    50% {
      transform: translateY(-50vh) translateX(30px) rotate(180deg) scale(1);
      opacity: 0.5;
    }
    90% { opacity: 0.3; }
    100% {
      transform: translateY(-120vh) translateX(-20px) rotate(360deg) scale(0.7);
      opacity: 0;
    }
  }

  /* ---------------- DATEPICKER ---------------- */
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container input {
    height: 3rem;
    width: 100%;
  }

  .custom-calendar {
    font-family: inherit;
    border-radius: 14px;
    border: 2px solid rgba(212,197,232,0.3);
    box-shadow: 0 8px 32px rgba(45,27,78,0.15);
  }

  .react-datepicker__header {
    background: linear-gradient(135deg, #E91E63, #9C27B0);
    border-bottom: none;
    border-radius: 14px 14px 0 0;
    padding: 10px;
  }

  .react-datepicker__current-month,
  .react-datepicker__day-name {
    color: white;
    font-weight: 600;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background: linear-gradient(135deg, #E91E63, #9C27B0);
    color: white;
  }

  .react-datepicker__day:hover {
    background: rgba(233,30,99,0.2);
  }

  /* ---------------- DROPDOWNS (50px HEIGHT) ---------------- */
  .react-datepicker__year-dropdown,
  .react-datepicker__month-dropdown {
    max-height: 50px !important;
    height: auto !important;
    min-width: 85px !important;
    padding: 2px !important;
    overflow-y: auto !important;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  /* SMALL COMPACT ROWS */
  .react-datepicker__year-option,
  .react-datepicker__month-option {
    padding: 4px 8px;
    margin: 1px 2px;
    font-size: 12px;
    border-radius: 6px;
    cursor: pointer;
  }

  .react-datepicker__year-option:hover,
  .react-datepicker__month-option:hover {
    background: rgba(233,30,99,0.15);
    transform: none;
  }

  .react-datepicker__year-option--selected,
  .react-datepicker__month-option--selected {
    background: linear-gradient(135deg, #E91E63, #9C27B0);
    color: white;
    font-weight: 600;
  }

  /* READ VIEW */
  .react-datepicker__year-read-view,
  .react-datepicker__month-read-view {
    padding: 4px 8px;
    font-size: 13px;
    font-weight: 600;
    color: white;
    background: rgba(255,255,255,0.2);
    border-radius: 6px;
  }

  .react-datepicker__year-read-view--down-arrow,
  .react-datepicker__month-read-view--down-arrow {
    border-top-color: white;
    margin-left: 6px;
  }

  /* SCROLLBAR */
  .react-datepicker__year-dropdown::-webkit-scrollbar,
  .react-datepicker__month-dropdown::-webkit-scrollbar {
    width: 5px;
  }

  .react-datepicker__year-dropdown::-webkit-scrollbar-thumb,
  .react-datepicker__month-dropdown::-webkit-scrollbar-thumb {
    background: #E91E63;
    border-radius: 10px;
  }
`}</style>
<style>{`
  @keyframes continuousFloat {
    0% {
      transform: translateY(0) translateX(0) rotate(0deg) scale(0.8);
      opacity: 0;
    }
    10% { opacity: 0.6; }
    50% {
      transform: translateY(-50vh) translateX(30px) rotate(180deg) scale(1);
      opacity: 0.5;
    }
    90% { opacity: 0.3; }
    100% {
      transform: translateY(-120vh) translateX(-20px) rotate(360deg) scale(0.7);
      opacity: 0;
    }
  }

  /* ---------------- DATEPICKER ---------------- */
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container input {
    height: 3rem;
    width: 100%;
  }

  .custom-calendar {
    font-family: inherit;
    border-radius: 14px;
    border: 2px solid rgba(212,197,232,0.3);
    box-shadow: 0 8px 32px rgba(45,27,78,0.15);
  }

  .react-datepicker__header {
    background: linear-gradient(135deg, #E91E63, #9C27B0);
    border-bottom: none;
    border-radius: 14px 14px 0 0;
    padding: 10px;
  }

  .react-datepicker__current-month,
  .react-datepicker__day-name {
    color: white;
    font-weight: 600;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background: linear-gradient(135deg, #E91E63, #9C27B0);
    color: white;
  }

  .react-datepicker__day:hover {
    background: rgba(233,30,99,0.2);
  }

  /* ---------------- DROPDOWNS (50px HEIGHT) ---------------- */
  .react-datepicker__year-dropdown,
  .react-datepicker__month-dropdown {
    max-height: 50px !important;
    height: auto !important;
    min-width: 85px !important;
    padding: 2px !important;
    overflow-y: auto !important;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  /* SMALL COMPACT ROWS */
  .react-datepicker__year-option,
  .react-datepicker__month-option {
    padding: 4px 8px;
    margin: 1px 2px;
    font-size: 12px;
    border-radius: 6px;
    cursor: pointer;
  }

  .react-datepicker__year-option:hover,
  .react-datepicker__month-option:hover {
    background: rgba(233,30,99,0.15);
    transform: none;
  }

  .react-datepicker__year-option--selected,
  .react-datepicker__month-option--selected {
    background: linear-gradient(135deg, #E91E63, #9C27B0);
    color: white;
    font-weight: 600;
  }

  /* READ VIEW */
  .react-datepicker__year-read-view,
  .react-datepicker__month-read-view {
    padding: 4px 8px;
    font-size: 13px;
    font-weight: 600;
    color: white;
    background: rgba(255,255,255,0.2);
    border-radius: 6px;
  }

  .react-datepicker__year-read-view--down-arrow,
  .react-datepicker__month-read-view--down-arrow {
    border-top-color: white;
    margin-left: 6px;
  }

  /* SCROLLBAR */
  .react-datepicker__year-dropdown::-webkit-scrollbar,
  .react-datepicker__month-dropdown::-webkit-scrollbar {
    width: 5px;
  }

  .react-datepicker__year-dropdown::-webkit-scrollbar-thumb,
  .react-datepicker__month-dropdown::-webkit-scrollbar-thumb {
    background: #E91E63;
    border-radius: 10px;
  }
`}</style>


      </div>
    </>
  );
}
