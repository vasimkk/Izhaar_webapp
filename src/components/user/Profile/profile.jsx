import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import couplePose from "../../../assets/images/C.png";
import api from "../../../utils/api";

export default function UserProfile() {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Personal, 2: Contact, 3: Photo
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

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

  // Route Guard
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const agreeRes = await api.get("/user-agreement/status");
        if (!agreeRes.data?.agreed) {
          navigate("/welcome", { replace: true });
          return;
        }

        const profileRes = await api.get("/profile/me");
        const profileData = profileRes.data.profile || profileRes.data;
        const hasProfile = profileData && (profileData.id || profileData._id);

        if (hasProfile) {
          try {
            const templateRes = await api.get("/user/template-history");
            if (templateRes.data && templateRes.data.length > 0) {
              navigate("/user/dashboard", { replace: true });
              return;
            } else {
              navigate("/user/select-template", { replace: true });
              return;
            }
          } catch {
            navigate("/user/select-template", { replace: true });
            return;
          }
        }
      } catch (err) {
        if (err.response?.status !== 404) {
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

  // Intercept Browser Back Button
  // Intercept Browser Back Button
  useEffect(() => {
    // 1. Push a state into history so that clicking "Back" triggers a popstate event
    //    We do this immediately on mount.
    window.history.pushState(null, document.title, window.location.href);

    const handlePopState = (event) => {
      // 2. When the user clicks back, this event fires.
      //    We want to prevent leaving, so we push the state AGAIN to keep them here.
      window.history.pushState(null, document.title, window.location.href);

      // 3. Show the confirmation modal
      setShowExitConfirm(true);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

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

  const handleBackRequest = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = (e) => {
    e.preventDefault();
    setAccessToken(null);
    navigate("/entry");
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
        theme="dark" // Changed to dark theme for toast
      />
      <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #581C87 0%, #312E81 50%, #1E3A8A 100%)',
          backgroundAttachment: 'fixed'
        }}>

        {/* Animation Styles */}
        <style>{`
        @keyframes float-up {
          0% { transform: translateY(110vh) translateX(0) scale(0.8); opacity: 0; }
          10% { opacity: 0.6; }
          50% { transform: translateY(50vh) translateX(20px) scale(1.1); }
          100% { transform: translateY(-10vh) translateX(-20px) scale(0.8); opacity: 0; }
        }
        @keyframes sparkle-blink {
          0%, 100% { opacity: 0.3; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .love-icon {
          position: absolute;
          z-index: 1;
          filter: drop-shadow(0 0 10px rgba(255, 105, 180, 0.5));
        }

        /* ---------------- DATEPICKER DARK THEME ---------------- */
        .react-datepicker-wrapper {
          width: 100%;
        }

        .react-datepicker__input-container input {
          height: 3rem;
          width: 100%;
        }

        .custom-calendar-dark {
          font-family: inherit;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.2) !important;
          background-color: #1e1e2e !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
          color: white;
        }

        .react-datepicker__header {
          background: linear-gradient(135deg, #E91E63, #9C27B0);
          border-bottom: none;
          border-radius: 14px 14px 0 0;
          padding: 10px;
        }

        .react-datepicker__current-month,
        .react-datepicker__day-name,
        .react-datepicker-time__header {
          color: white !important;
          font-weight: 600;
        }

        .react-datepicker__day {
          color: #e0e0e0;
        }
        .react-datepicker__day:hover {
          background-color: rgba(233,30,99,0.3) !important;
          color: white;
          border-radius: 50%;
        }

        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background: linear-gradient(135deg, #E91E63, #9C27B0) !important;
          color: white !important;
          border-radius: 50%;
        }

        /* DROPDOWNS (Scroll Mode) */
        .react-datepicker__year-dropdown,
        .react-datepicker__month-dropdown,
        .react-datepicker__month-year-dropdown {
          background-color: #2d2d44 !important;
          border: 1px solid rgba(255,255,255,0.2) !important;
          border-radius: 8px;
          max-height: 250px !important;
          overflow-y: auto !important;
          padding: 5px;
          width: auto !important;
        }

        .react-datepicker__year-option,
        .react-datepicker__month-option {
          color: #e0e0e0;
          padding: 5px 10px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .react-datepicker__year-option:hover,
        .react-datepicker__month-option:hover {
          background-color: #E91E63 !important;
          color: white !important;
          border-radius: 4px;
        }
        
        .react-datepicker__year-read-view--down-arrow,
        .react-datepicker__month-read-view--down-arrow,
        .react-datepicker__month-year-read-view--down-arrow {
            border-top-color: #fff !important;
        }
        
        .react-datepicker__year-read-view:hover .react-datepicker__year-read-view--down-arrow,
        .react-datepicker__month-read-view:hover .react-datepicker__month-read-view--down-arrow {
            border-top-color: #E91E63 !important;
        }
        
        .react-datepicker__navigation--years-upcoming,
        .react-datepicker__navigation--years-previous {
            border-bottom-color: #ccc !important;
            border-top-color: #ccc !important;
            margin: 5px auto;
        }

        /* SCROLLBAR for Dropdowns */
        .react-datepicker__year-dropdown::-webkit-scrollbar,
        .react-datepicker__month-dropdown::-webkit-scrollbar {
          width: 6px;
        }
        .react-datepicker__year-dropdown::-webkit-scrollbar-track,
        .react-datepicker__month-dropdown::-webkit-scrollbar-track {
           background: #1e1e2e; 
        }
        .react-datepicker__year-dropdown::-webkit-scrollbar-thumb,
        .react-datepicker__month-dropdown::-webkit-scrollbar-thumb {
          background: #E91E63;
          border-radius: 10px;
        }

      `}</style>

        {/* Mobile Back Button */}
        <button
          onClick={handleBackRequest}
          className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5 text-white"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Exit Confirmation Modal */}
        {showExitConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-[#1e1e2e] border border-white/10 rounded-2xl p-6 shadow-2xl w-full max-w-sm text-center transform transition-all scale-100 relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-600"></div>

              <h3 className="text-xl font-bold text-white mb-2">Change Account?</h3>
              <p className="text-gray-300 text-sm mb-6">
                Do you want to discard changes and go back to the entry page?
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors border border-white/10"
                >
                  No, Stay
                </button>
                <button
                  onClick={confirmExit}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-lg shadow-pink-500/20 transition-transform active:scale-95"
                >
                  Yes, Leave
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Animated Background Icons (Hearts, Letters, Rings) */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden fixed h-full w-full">
          {/* Floating Icons with negative delay */}
          {[...Array(20)].map((_, i) => {
            const iconType = i % 4; // 0: Heart, 1: Letter, 2: Ring, 3: Star
            return (
              <div
                key={`icon-${i}`}
                className="love-icon"
                style={{
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 30 + 20}px`,
                  height: `${Math.random() * 30 + 20}px`,
                  animation: `float-up ${Math.random() * 15 + 10}s linear infinite -${Math.random() * 15}s`,
                  opacity: Math.random() * 0.5 + 0.3,
                  color: ['#fb7185', '#e879f9', '#60a5fa', '#fcd34d'][Math.floor(Math.random() * 4)] // Pink, Purple, Blue, Gold
                }}
              >
                {iconType === 0 && (
                  // Heart
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                )}
                {iconType === 1 && (
                  // Envelope/Letter
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                )}
                {iconType === 2 && (
                  // Ring/Circle
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                )}
                {iconType === 3 && (
                  // Star/Sparkle
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                  </svg>
                )}
              </div>
            );
          })}

          {/* Twinkling Stars Background */}
          {[...Array(50)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute bg-white rounded-full z-0"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 2}px`,
                height: `${Math.random() * 2}px`,
                opacity: Math.random() * 0.6 + 0.2,
                animation: `sparkle-blink ${Math.random() * 4 + 3}s ease-in-out infinite -${Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 py-8 lg:py-0 gap-6 md:gap-8 lg:gap-12 relative" style={{ zIndex: 1 }}>
          <div className="hidden md:flex flex-1 items-center justify-center w-full">
            <div className="relative w-full max-w-xs md:max-w-md lg:max-w-lg flex items-center justify-center">
              <div
                className="absolute w-96 h-96 rounded-full opacity-30 blur-3xl"
                style={{
                  background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                  animation: 'pulse 4s ease-in-out infinite'
                }}
              />
              <img
                src={couplePose}
                alt="Couple"
                className="w-full h-auto object-contain drop-shadow-2xl relative z-10"
                style={{
                  filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5))'
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
                borderColor: 'rgba(255, 255, 255, 0.15)',
                background: 'rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 text-center tracking-wide drop-shadow-md">
                {step === 1 && "Profile Details"}
                {step === 2 && "Contact Information"}
                {step === 3 && "Upload Photo"}
              </h2>

              {/* Stepper */}
              <div className="mb-6 sm:mb-8">
                <div className="relative h-1 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${(step / 3) * 100}%`,
                      background:
                        "linear-gradient(90deg, #E91E63 0%, #9C27B0 100%)",
                    }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-300">Step {step} of 3</span>
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
                  <label className="block text-sm sm:text-base text-gray-200 mb-1 font-medium">
                    Name <span className="text-pink-400">*</span>
                  </label>
                  <input
                    className={`w-full px-4 sm:px-5 rounded-2xl bg-white/5 backdrop-blur-md text-white text-sm sm:text-base border border-white/20 placeholder-white/30 focus:outline-none focus:border-pink-500 shadow-lg transition-all ${nameError ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                    style={{ height: '3rem' }}
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                  />
                  {nameError && (
                    <p className="text-red-400 text-xs mt-1 ml-1">{nameError}</p>
                  )}
                  {!nameError && form.name && (
                    <div className="mb-1"></div>
                  )}

                  <label className="block text-sm sm:text-base text-gray-200 mb-1 font-medium">
                    Gender <span className="text-pink-400">*</span>
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
                            className="w-4 h-4 cursor-pointer appearance-none rounded-full border-2 border-white/40 checked:border-[#E91E63]"
                            style={{ background: form.gender === g ? "#E91E63" : "transparent" }}
                          />
                          {form.gender === g && (
                            <div className="absolute w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span
                          className={`text-sm sm:text-base font-medium ${form.gender === g ? "text-white" : "text-gray-400"
                            }`}
                        >
                          {g}
                        </span>
                      </label>
                    ))}
                  </div>

                  <label className="block text-sm sm:text-base text-gray-200 mb-1 font-medium">
                    Date of Birth <span className="text-pink-400">*</span>
                  </label>
                  <div className="relative w-full mb-1">
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDatePickerChange}
                      dateFormat="MMMM d, yyyy"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="scroll"
                      yearDropdownItemNumber={80}
                      scrollableYearDropdown
                      maxDate={new Date()}
                      minDate={new Date(1950, 0, 1)}
                      placeholderText="Select your date of birth"
                      className={`w-full pl-12 pr-4 sm:pr-5 rounded-2xl bg-white/5 backdrop-blur-md text-white text-sm sm:text-base border border-white/20 placeholder-white/30 focus:outline-none focus:border-pink-500 shadow-lg transition-all ${dobError ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                      wrapperClassName="w-full"
                      calendarClassName="custom-calendar-dark"
                      style={{ height: '3rem' }}
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-300"
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
                    <p className="text-red-400 text-xs mt-1 ml-1">{dobError}</p>
                  )}
                  {!dobError && form.dob && (
                    <div className="mb-1"></div>
                  )}

                  <label className="block text-sm sm:text-base text-gray-200 mb-1 font-medium">
                    Age <span className="text-pink-400">*</span>
                  </label>
                  <input
                    className="w-full px-4 sm:px-5 rounded-2xl bg-white/5 backdrop-blur-md text-white text-sm sm:text-base border border-white/20 placeholder-white/30 focus:outline-none focus:border-pink-500 shadow-lg transition-all"
                    style={{ height: '3rem' }}
                    placeholder="Age"
                    value={form.age?.toString()}
                    readOnly
                  />

                  <button
                    className="w-full font-bold mt-4 rounded-lg text-sm sm:text-base py-3 text-white transition-all transform hover:scale-[1.02] active:scale-95"
                    style={{
                      background: (form.name && form.dob && form.gender && !nameError && !dobError) ? 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)' : 'rgba(255,255,255,0.1)',
                      boxShadow: (form.name && form.dob && form.gender && !nameError && !dobError) ? '0 4px 15px 0 rgba(233, 30, 99, 0.4)' : 'none',
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
                  <label className="block text-sm sm:text-base text-gray-200 mb-1 font-medium">
                    Mobile <span className="text-pink-400">*</span>
                  </label>
                  <input
                    className={`w-full px-4 sm:px-5 rounded-2xl bg-white/5 backdrop-blur-md text-white text-sm sm:text-base border border-white/20 placeholder-white/30 focus:outline-none focus:border-pink-500 shadow-lg transition-all ${mobileError ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                    style={{ height: '3rem' }}
                    placeholder="10-digit mobile number"
                    value={form.mobile}
                    onChange={(e) => handleMobileChange(e.target.value)}
                    type="tel"
                    maxLength={10}
                  />
                  {mobileError && (
                    <p className="text-red-400 text-xs mt-1 ml-1">{mobileError}</p>
                  )}
                  {!mobileError && form.mobile && (
                    <div className="mb-1"></div>
                  )}

                  <label className="block text-sm sm:text-base text-gray-200 mb-1 font-medium">
                    Email <span className="text-pink-400">*</span>
                  </label>
                  <input
                    className={`w-full px-4 sm:px-5 rounded-2xl bg-white/5 backdrop-blur-md text-white text-sm sm:text-base border border-white/20 placeholder-white/30 focus:outline-none focus:border-pink-500 shadow-lg transition-all ${emailError ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                    style={{ height: '3rem' }}
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    type="email"
                  />
                  {emailError && (
                    <p className="text-red-400 text-xs mt-1 ml-1">{emailError}</p>
                  )}
                  {!emailError && form.email && (
                    <div className="mb-1"></div>
                  )}

                  <label className="block text-sm sm:text-base text-gray-200 mb-1 font-medium">
                    Instagram URL
                  </label>
                  <input
                    className="w-full px-4 sm:px-5 rounded-2xl bg-white/5 backdrop-blur-md text-white text-sm sm:text-base border border-white/20 placeholder-white/30 focus:outline-none focus:border-pink-500 shadow-lg transition-all"
                    style={{ height: '3rem' }}
                    placeholder="Instagram URL"
                    value={form.social_platforms.instagram}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        social_platforms: { ...form.social_platforms, instagram: e.target.value },
                      })
                    }
                  />

                  <div className="flex gap-3 mt-4">
                    <button
                      className="flex-1 text-white font-bold rounded-lg text-sm sm:text-base py-3 transition-colors hover:bg-white/10"
                      style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)" }}
                      type="button"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </button>
                    <button
                      className="flex-1 text-white font-bold rounded-lg text-sm sm:text-base py-3 transition-all transform hover:scale-[1.02] active:scale-95"
                      style={{
                        background: (form.mobile && form.email && !mobileError && !emailError) ? 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)' : 'rgba(255,255,255,0.1)',
                        boxShadow: (form.mobile && form.email && !mobileError && !emailError) ? '0 4px 15px 0 rgba(233, 30, 99, 0.4)' : 'none',
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
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-white/20 flex items-center justify-center overflow-hidden cursor-pointer shadow-xl relative group"
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        cursor: uploadingPhoto ? "not-allowed" : "pointer",
                      }}
                    >
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs">Change</span>
                      </div>
                      {uploadingPhoto ? (
                        <span className="text-white font-bold text-xs">Uploading...</span>
                      ) : form.profile_photo ? (
                        <img
                          src={form.profile_photo}
                          alt="Profile"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-4xl">📷</span>
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
                  <p className="text-center text-xs sm:text-sm text-gray-300 mb-6">
                    ✓ Your photo is safe and secure
                  </p>
                  <div className="flex gap-3">
                    <button
                      className="flex-1 text-white font-bold rounded-lg text-sm sm:text-base py-3 transition-colors hover:bg-white/10"
                      style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)" }}
                      type="button"
                      onClick={() => setStep(2)}
                    >
                      Back
                    </button>
                    <button
                      className="flex-1 text-white font-bold rounded-lg text-sm sm:text-base py-3 transition-all transform hover:scale-[1.02] active:scale-95"
                      style={{
                        background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                        boxShadow: '0 4px 15px 0 rgba(233, 30, 99, 0.4)',
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
    </>
  );
}
