import { useNavigate } from "react-router-dom";
import { useState } from "react";
import bgimg from "../../../assets/images/bgimg.png";
import api from "../../../utils/api";
export default function UserProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Personal, 2: Contact, 3: Photo
  const [form, setForm] = useState({
    name: "",
    gender: "",
    dob: "",
    age: "",
    mobile: "",
    email: "",
    social_platforms: {
      instagram: "",
      facebook: "",
    },
    profile_photo: "",
  });

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ⭐ PICK & UPLOAD PROFILE PHOTO (Web)
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
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

  // ⭐ GENDER OPTIONS
  const genders = ["Male", "Female", "Other"];

  // ⭐ DATE INPUT HANDLER (Web)
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

  // ⭐ CREATE PROFILE (POST)
  const createProfile = async () => {
    if (!form.name || !form.dob || !form.gender || !form.mobile || !form.email) {
      return alert("Please fill all required fields");
    }

    try {
      setLoading(true);

      // Build payload matching backend schema
      const data = {
        name: form.name.trim(),
        age: parseInt(form.age) || 0,
        gender: form.gender,
        mobile: form.mobile.trim(),
        email: form.email.trim(),
        terms_agreed: true,
        nickname: form.nickname?.trim() || null,
        about: null,
        // Only send social_platforms if at least one is filled
        social_platforms: {
          instagram: form.social_platforms.instagram?.trim() || "",
          facebook: form.social_platforms.facebook?.trim() || "",
          ...(form.social_platforms.linkedin?.trim() && { linkedin: form.social_platforms.linkedin.trim() })
        },
        // Skip profile_photo for now (blob URLs don't persist in DB)
        // TODO: Implement proper file upload instead
      };

      console.log('[Profile] Creating profile with data:', data);
      const res = await api.post("/profile", data);
      console.log('[Profile] Profile created successfully:', res.data);

      alert("Profile created successfully!");
      navigate("/welcome");
    } catch (err) {
      console.error('[Profile] Profile creation error:', err.response?.status, err.response?.data);
      alert(err.response?.data?.message || err.message || "Profile creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-black flex items-center justify-center px-2"
      style={{
        backgroundImage: `url(${bgimg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="w-full max-w-xl  p-4 sm:p-8  flex flex-col items-center">
        <h2 className="text-xl sm:text-2xl font-bold text-pink-500 mb-4 sm:mb-6 text-center tracking-wide">Let’s build your profile</h2>
        {/* Stepper Indicator */}
        <div className="flex flex-row justify-center mb-4 sm:mb-6 mt-2">
          {[1,2,3].map((s) => (
            <div key={s} className={`w-4 sm:w-5 h-1.5 rounded-full mx-0.5 sm:mx-1 ${step === s ? "bg-pink-500" : "bg-neutral-700"}`} />
          ))}
        </div>

        {/* SECTION 1: PERSONAL INFORMATION */}
        {step === 1 && (
          <div className="w-full bg-neutral-800 rounded-xl p-3 sm:p-6 mt-4 mb-2 shadow border border-neutral-700">
            <h3 className="text-lg sm:text-xl font-bold text-pink-500 mb-2 sm:mb-4 text-center">Personal Information</h3>
            <input
              className="w-full border border-neutral-700 bg-neutral-900 p-2 sm:p-3 rounded-lg mb-3 sm:mb-4 text-base text-white placeholder:text-neutral-400"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
            />
            <div className="flex flex-row flex-wrap justify-between mb-3 sm:mb-4 gap-2">
              {genders.map((g) => (
                <button
                  key={g}
                  className={`flex-1 min-w-[90px] p-2 sm:p-3 border rounded-lg text-center font-medium ${form.gender === g ? "bg-pink-500 border-pink-500 text-white" : "bg-neutral-900 border-neutral-700 text-neutral-400"}`}
                  type="button"
                  onClick={() => setField("gender", g)}
                >
                  {g}
                </button>
              ))}
            </div>
            <input
              className="w-full border border-neutral-700 bg-neutral-900 p-2 sm:p-3 rounded-lg mb-3 sm:mb-4 text-base text-white placeholder:text-neutral-400"
              type="date"
              placeholder="Select Date of Birth"
              value={form.dob}
              onChange={onDateChange}
            />
            <input
              className="w-full border border-neutral-700 bg-neutral-900 p-2 sm:p-3 rounded-lg mb-3 sm:mb-4 text-base text-white placeholder:text-neutral-400"
              placeholder="Age"
              value={form.age?.toString()}
              readOnly
            />
            <button className="w-full sm:w-11/12 bg-pink-500 py-3 sm:py-4 rounded-lg font-bold text-white mt-4 sm:mt-6 mb-4 sm:mb-6 mx-auto block" type="button" onClick={() => setStep(2)}>
              Next
            </button>
          </div>
        )}

        {/* SECTION 2: CONTACT INFORMATION */}
        {step === 2 && (
          <div className="w-full bg-neutral-800 rounded-xl p-3 sm:p-6 mt-4 mb-2 shadow border border-neutral-700">
            <h3 className="text-lg sm:text-xl font-bold text-pink-500 mb-2 sm:mb-4 text-center">Contact Information</h3>
            <input
              className="w-full border border-neutral-700 bg-neutral-900 p-2 sm:p-3 rounded-lg mb-3 sm:mb-4 text-base text-white placeholder:text-neutral-400"
              placeholder="Mobile"
              value={form.mobile}
              onChange={(e) => setField("mobile", e.target.value)}
              type="tel"
            />
            <input
              className="w-full border border-neutral-700 bg-neutral-900 p-2 sm:p-3 rounded-lg mb-3 sm:mb-4 text-base text-white placeholder:text-neutral-400"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              type="email"
            />
            <input
              className="w-full border border-neutral-700 bg-neutral-900 p-2 sm:p-3 rounded-lg mb-3 sm:mb-4 text-base text-white placeholder:text-neutral-400"
              placeholder="Instagram URL"
              value={form.social_platforms.instagram}
              onChange={(e) =>
                setForm({
                  ...form,
                  social_platforms: { ...form.social_platforms, instagram: e.target.value },
                })
              }
            />
            <div className="flex flex-row flex-wrap justify-between mt-2 gap-2">
              <button className="bg-neutral-700 text-white py-3 sm:py-4 rounded-lg font-bold w-full sm:w-1/2" type="button" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="bg-pink-500 text-white py-3 sm:py-4 rounded-lg font-bold w-full sm:w-1/2" type="button" onClick={() => setStep(3)}>
                Next
              </button>
            </div>
          </div>
        )}

        {/* SECTION 3: UPLOAD PHOTO */}
        {step === 3 && (
          <div className="w-full bg-neutral-800 rounded-xl p-3 sm:p-6 mt-4 mb-2 shadow border border-neutral-700">
            <h3 className="text-lg sm:text-xl font-bold text-pink-500 mb-2 sm:mb-4 text-center">Upload Photo</h3>
            <div className="flex items-center justify-center mt-2 mb-2">
              <label htmlFor="profile-photo-upload" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-neutral-900 border-2 border-pink-500 flex items-center justify-center overflow-hidden cursor-pointer" style={{ cursor: uploadingPhoto ? "not-allowed" : "pointer" }}>
                {uploadingPhoto ? (
                  <span className="text-pink-500 font-bold">Uploading...</span>
                ) : form.profile_photo ? (
                  <img src={form.profile_photo} alt="Profile" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-3xl sm:text-4xl text-white">📸</span>
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
            <div className="flex flex-row flex-wrap justify-between mt-2 gap-2">
              <button className="bg-neutral-700 text-white py-3 sm:py-4 rounded-lg font-bold w-full sm:w-1/2" type="button" onClick={() => setStep(2)}>
                Back
              </button>
              <button className="bg-pink-500 text-white py-3 sm:py-4 rounded-lg font-bold w-full sm:w-1/2" type="button" onClick={createProfile} disabled={uploadingPhoto}>
                {loading ? "Creating..." : uploadingPhoto ? "Uploading..." : "Finish"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Add CSS classes in your stylesheet for .profile-safe, .profile-scroll, .profile-sectionCard, .profile-sectionHeader, .profile-input, .profile-dropdown, .profile-option, .profile-optionSelected, .profile-avatarCircle, .profile-avatarImage, .profile-btn, .profile-btnBack, .profile-btnRow, .profile-stepper, .profile-step, .active, .profile-loading
