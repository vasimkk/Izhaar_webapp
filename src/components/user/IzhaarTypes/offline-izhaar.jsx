import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../../../assets/video/Stars_1.mp4";

export default function OfflineIzhaar() {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const navigate = useNavigate();

  const handleAgree = () => {
    if (agreedToTerms) {
      navigate('/user/letter/payment-subscription/offline');
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col">

      <div className="relative z-10 w-full max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-row items-center justify-between mb-6 sm:mb-10">
          <button 
            onClick={() => navigate(-1)} 
            className="sm:hidden text-white text-2xl font-bold w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-all"
          >
            ←
          </button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide flex-1 text-center text-white">Offline Izhaar</h1>
          <div className="sm:hidden w-10" />
        </div>

        {/* Main content */}
        <div className="space-y-4 sm:space-y-6 pb-8 sm:pb-10">
          {/* Introduction Card */}
          <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-5 sm:p-8 border border-white/20 shadow-lg">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-3xl sm:text-4xl flex-shrink-0">💌</div>
              <div className="flex-1">
                <div className="text-base sm:text-xl font-semibold text-white mb-3">Welcome to Offline Izhaar</div>
                <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                  Create beautiful love letters digitally and we'll help deliver them offline. Share your feelings in a unique and personal way with our special delivery service.
                </p>
              </div>
            </div>
          </div>

          {/* Features Card */}
          <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-5 sm:p-8 border border-white/20 shadow-lg">
            <div className="text-base sm:text-lg font-semibold text-white mb-4">✨ Features</div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm sm:text-base text-white/90">
                <span className="text-lg">🎨</span>
                <span>Choose from 4 beautiful letter templates</span>
              </div>
              <div className="flex items-center gap-3 text-sm sm:text-base text-white/90">
                <span className="text-lg">✍️</span>
                <span>Write personalized love letters with AI assistance</span>
              </div>
              <div className="flex items-center gap-3 text-sm sm:text-base text-white/90">
                <span className="text-lg">🎬</span>
                <span>Record video messages (optional)</span>
              </div>
              <div className="flex items-center gap-3 text-sm sm:text-base text-white/90">
                <span className="text-lg">🎵</span>
                <span>Attach songs to make it more special</span>
              </div>
              <div className="flex items-center gap-3 text-sm sm:text-base text-white/90">
                <span className="text-lg">📮</span>
                <span>Offline delivery support available</span>
              </div>
            </div>
          </div>

          {/* Instructions Card */}
          <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-5 sm:p-8 border border-white/20 shadow-lg">
            <div className="text-base sm:text-lg font-semibold text-white mb-4">📋 Instructions</div>
            <div className="space-y-3">
              <div className="flex gap-3 text-sm sm:text-base text-white/90">
                <span className="font-bold text-pink-400 flex-shrink-0">1.</span>
                <span>Select your preferred letter template</span>
              </div>
              <div className="flex gap-3 text-sm sm:text-base text-white/90">
                <span className="font-bold text-pink-400 flex-shrink-0">2.</span>
                <span>Fill in the recipient's details and your feelings</span>
              </div>
              <div className="flex gap-3 text-sm sm:text-base text-white/90">
                <span className="font-bold text-pink-400 flex-shrink-0">3.</span>
                <span>Customize with videos, songs, or personal touch</span>
              </div>
              <div className="flex gap-3 text-sm sm:text-base text-white/90">
                <span className="font-bold text-pink-400 flex-shrink-0">4.</span>
                <span>Choose delivery method (digital or offline)</span>
              </div>
              <div className="flex gap-3 text-sm sm:text-base text-white/90">
                <span className="font-bold text-pink-400 flex-shrink-0">5.</span>
                <span>Make payment and complete your order</span>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg overflow-hidden">
            <div 
              className="p-5 sm:p-8 cursor-pointer hover:bg-white/5 transition-all"
              onClick={() => setShowTerms(!showTerms)}
            >
              <div className="flex items-center justify-between">
                <div className="text-base sm:text-lg font-semibold text-white">📜 Terms & Conditions</div>
                <span className="text-2xl text-white/70">{showTerms ? '▼' : '▶'}</span>
              </div>
            </div>

            {showTerms && (
              <div className="px-5 sm:px-8 pb-5 sm:pb-8 border-t border-white/10 max-h-64 overflow-y-auto">
                <div className="space-y-3 text-xs sm:text-sm text-white/80">
                  <p>
                    <span className="font-semibold text-white">1. Service Agreement:</span> By using our Offline Izhaar service, you agree to create letters for personal, non-commercial use only.
                  </p>
                  <p>
                    <span className="font-semibold text-white">2. Delivery Policy:</span> Offline delivery is subject to availability. Delivery times may vary based on location and accessibility.
                  </p>
                  <p>
                    <span className="font-semibold text-white">3. Content Policy:</span> All letters must comply with our community guidelines. We reserve the right to reject letters containing inappropriate content.
                  </p>
                  <p>
                    <span className="font-semibold text-white">4. Privacy:</span> Recipient information is handled securely and used only for delivery purposes.
                  </p>
                  <p>
                    <span className="font-semibold text-white">5. Payment:</span> All payments are final. Refunds are available only if delivery cannot be completed.
                  </p>
                  <p>
                    <span className="font-semibold text-white">6. Liability:</span> We are not responsible for delays caused by circumstances beyond our control.
                  </p>
                  <p>
                    <span className="font-semibold text-white">7. Contact:</span> For any issues, please contact our support team within 7 days of service completion.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Checkbox & Action Button */}
          <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-5 sm:p-8 border border-white/20 shadow-lg">
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer hover:opacity-80 transition">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded cursor-pointer"
                />
                <span className="text-sm sm:text-base text-white/90">
                  I agree to the Terms & Conditions and understand the offline delivery policy
                </span>
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex-1 px-6 py-3 rounded-lg text-base sm:text-lg font-bold text-white bg-white/20 hover:bg-white/30 border border-white/30 transition-all duration-200 shadow-lg"
                >
                  Back
                </button>
                <button
                  onClick={handleAgree}
                  disabled={!agreedToTerms}
                  className={`flex-1 px-6 py-3 rounded-lg text-base sm:text-lg font-bold text-white transition-all duration-200 shadow-lg ${
                    agreedToTerms
                      ? 'hover:opacity-90'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  style={{
                    background: agreedToTerms
                      ? 'linear-gradient(90deg, rgba(255, 71, 71, 0.63) 0%, rgba(206, 114, 255, 0.63) 28.65%, rgba(157, 209, 255, 0.63) 68.84%, rgba(255, 210, 97, 0.63) 100%)'
                      : 'rgba(100, 100, 100, 0.5)'
                  }}
                >
                  Continue →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
