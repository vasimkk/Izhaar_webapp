import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useReceiverForLetter } from "../../../context/ReceiverForLetterContext";
import api from "../../../utils/api";

export default function SongPreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { receiverDetails } = useReceiverForLetter();
  
  const { audioUrl, lyrics, style, mood, vocal } = location.state || {};
  
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [sendSuccess, setSendSuccess] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  if (!audioUrl) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-4">No song data found. Please generate a song first.</p>
          <button 
            onClick={() => navigate("/user/song/create")}
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            Go Back to Create
          </button>
        </div>
      </div>
    );
  }

  const dataURLToFile = (dataUrl, filename) => {
    try {
      const [meta, base64] = dataUrl.split(",");
      const mimeMatch = meta.match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : "audio/mpeg";
      const bstr = atob(base64);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    } catch (e) {
      return null;
    }
  };

  const handleSendSong = async () => {
    try {
      setSending(true);
      setSendError(null);
      setSendSuccess(null);

      const file = dataURLToFile(audioUrl, "izhaar-song.mp3");
      if (!file) {
        setSendError("Failed to prepare audio file for upload.");
        return;
      }

      const sender_id = receiverDetails?.sender_id || "USER123";
      const izhaar_code = receiverDetails?.izhaar_code || `IZH-${Date.now()}`;
      const receiver = receiverDetails?.receiver || receiverDetails || {};
      
      const form = new FormData();
      form.append("izhaar_code", izhaar_code);
      form.append("sender_id", sender_id);
      form.append("type", "SONG");
      form.append("template_id", "");
      form.append("message", lyrics || "");
      form.append("receiver", JSON.stringify(receiver));
      form.append("file", file);

      console.log('Submitting song payload:', { izhaar_code, sender_id, type: "SONG", message: lyrics, receiver });
      const response = await api.post("/izhaar/submit", form);
      
      // Capture the file path/URL from backend response
      const submitData = response?.data || {};
      console.log("Backend response:", submitData);
      const uploadedFileUrl = submitData.file_path || submitData.file_url || submitData.path || submitData.url;
      if (uploadedFileUrl) {
        setFileUrl(uploadedFileUrl);
        console.log("File Path stored in DB:", uploadedFileUrl);
      } else {
        console.warn("No file path in response. Full response:", submitData);
      }

      // After successful song submission, get latest payment and mark as USED
      try {
        const paymentRes = await api.get("/razorpay/payment-status", {
          params: { userId: sender_id, service: "song" }
        });
        const payment = paymentRes.data;
        if (payment && payment.payment_reference) {
          await api.post("/razorpay/mark-used", {
            userId: sender_id,
            paymentReference: payment.payment_reference
          });
          console.log("Payment marked as USED");
        } else {
          console.warn("No valid payment found to mark as USED");
        }
      } catch (err) {
        console.error("Failed to mark payment as USED", err);
      }

      setSendSuccess("Izhaar submitted successfully!");
      toast.success("Success ❤️ Song sent beautifully");
      
      // Navigate to dashboard after success
      setTimeout(() => {
        navigate("/user/dashboard");
      }, 2000);
    } catch (err) {
      setSendError(err.message || "Failed to send song");
      toast.error("Error: " + (err.message || "Failed"));
    } finally {
      setSending(false);
    }
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = "song.mp3";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative">
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 sm:px-6 md:px-8 py-8 sm:py-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h5 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
            🎉 Your Song is Ready!
          </h5>
          <p className="text-xs sm:text-sm md:text-base text-gray-300">
            Your personalized song has been generated successfully!
          </p>
        </div>

        {/* Main Container */}
        <div className="w-full max-w-2xl">
          {/* Audio Player */}
          <div className="rounded-3xl p-6 sm:p-8 md:p-10 mb-8 shadow-2xl backdrop-blur-lg border border-green-400/50"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 50, 30, 0.7) 0%, rgba(0, 30, 20, 0.5) 100%)'
            }}>
            <audio 
              controls 
              className="w-full rounded-lg"
              style={{
                colorScheme: 'dark'
              }}>
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>

          {/* Song Details */}
          <div className="rounded-3xl p-6 sm:p-8 md:p-10 mb-8 shadow-2xl backdrop-blur-lg border border-white/10"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)'
            }}>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Style</p>
                <p className="text-white font-semibold text-lg">{style}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Mood</p>
                <p className="text-white font-semibold text-lg">{mood}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Voice Type</p>
                <p className="text-white font-semibold text-lg">{vocal}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-8">
            <button 
              onClick={handleDownload}
              className="flex-1 py-3 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 font-semibold text-sm transition-all border border-green-400/50"
            >
              📥 Download
            </button>
            <button 
              onClick={handleSendSong}
              disabled={sending}
              className={`flex-1 py-3 rounded-lg font-semibold text-sm transition-all border bg-blue-500/20 text-blue-300 border-blue-400/50 ${sending ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 active:scale-95'}`}
            >
              ✉️ {sending ? 'Sending…' : 'Send'}
            </button>
          </div>

          {/* Back Button */}
          <button 
            onClick={() => navigate("/user/song/create")}
            className="w-full py-3 rounded-lg bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 font-semibold text-sm transition-all border border-gray-400/50"
          >
            ← Back to Create
          </button>

          {/* Error Message */}
          {sendError && (
            <div className="mt-4 p-4 rounded-lg bg-red-500/20 border border-red-400/50 text-red-300 text-sm text-center">
              {sendError}
            </div>
          )}

          {/* Success Message */}
          {sendSuccess && (
            <div className="mt-4 p-4 rounded-lg bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-sm text-center">
              {sendSuccess}
              {fileUrl && (
                <div className="mt-3 p-3 bg-black/30 rounded-lg text-xs text-emerald-200 font-mono text-left">
                  <p className="font-semibold mb-2">📁 File Stored in Database:</p>
                  <p className="break-all bg-black/50 p-2 rounded">🔗 {fileUrl}</p>
                  <p className="mt-2 text-emerald-300">✅ Other users can now download this song</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
