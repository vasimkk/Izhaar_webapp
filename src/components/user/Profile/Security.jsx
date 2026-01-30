import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import api from "../../../utils/api";

export default function Security() {
  const navigate = useNavigate();
  const [currentMobile, setCurrentMobile] = useState("");

  // Fetch current mobile number
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile/me");
        const profile = res.data.profile || res.data;
        setCurrentMobile(profile.mobile || "");
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4 hover:opacity-80 transition"
          >
            <FaArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-4xl sm:text-5xl font-bold">Security</h1>
          <p className="text-sm opacity-90 mt-2">Protect your Izhaar Love account</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 space-y-8">
          
          {/* Security Overview Section */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-purple-600 mb-4">Account Security</h2>
            <p className="text-gray-700 leading-relaxed">
              Keep your Izhaar Love account secure with strong security practices. Your account is protected with industry-standard security measures. Follow the guidelines below to ensure your account remains safe and secure.
            </p>
          </section>

          {/* Verified Status Section */}
          {currentMobile && (
            <section className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-green-700 mb-1">✓ Account Verified</h3>
                  <p className="text-gray-700">Your account security status is verified and protected</p>
                </div>
                <span className="text-5xl">🔒</span>
              </div>
            </section>
          )}

          {/* Security Features Section */}
          <section className="bg-purple-50 p-6 rounded-xl border border-purple-200">
            <h3 className="text-2xl font-bold text-purple-600 mb-6">Security Features</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🔐</span>
                <div>
                  <h4 className="font-semibold text-gray-800">Encrypted Data Storage</h4>
                  <p className="text-gray-600 text-sm">All your personal information is encrypted and stored securely</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-3xl">📱</span>
                <div>
                  <h4 className="font-semibold text-gray-800">Mobile Verification</h4>
                  <p className="text-gray-600 text-sm">Your account is linked to a verified mobile number for additional security</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-3xl">🛡️</span>
                <div>
                  <h4 className="font-semibold text-gray-800">Advanced Protection</h4>
                  <p className="text-gray-600 text-sm">We monitor suspicious activities and protect your account from unauthorized access</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-3xl">🚨</span>
                <div>
                  <h4 className="font-semibold text-gray-800">Real-time Alerts</h4>
                  <p className="text-gray-600 text-sm">Receive instant notifications for any account activity and login attempts</p>
                </div>
              </div>
            </div>
          </section>

          {/* Security Rules Section */}
          <section className="bg-blue-50 p-6 rounded-xl border border-blue-200">
            <h3 className="text-2xl font-bold text-blue-900 mb-6">🔒 Security Guidelines</h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-gray-800 mb-1">Strong Password</h4>
                <p className="text-gray-600 text-sm">Use a strong password with at least 8 characters including uppercase, lowercase, numbers, and special symbols</p>
              </div>
              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-gray-800 mb-1">Never Share OTP</h4>
                <p className="text-gray-600 text-sm">Your OTP (One-Time Password) is confidential. Never share it with anyone, even Izhaar Love staff members</p>
              </div>
              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-gray-800 mb-1">Verify Contact Information</h4>
                <p className="text-gray-600 text-sm">Keep your email and mobile number up to date for account recovery and important notifications</p>
              </div>
              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-gray-800 mb-1">Secure Connection</h4>
                <p className="text-gray-600 text-sm">Always use Izhaar Love on secure, trusted networks. Avoid using public Wi-Fi for sensitive transactions</p>
              </div>
              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-gray-800 mb-1">Logout After Use</h4>
                <p className="text-gray-600 text-sm">Always logout from your account when using shared devices or public computers</p>
              </div>
              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-gray-800 mb-1">Review Account Activity</h4>
                <p className="text-gray-600 text-sm">Regularly check your account activity and report any suspicious login attempts immediately</p>
              </div>
              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-gray-800 mb-1">Update Regularly</h4>
                <p className="text-gray-600 text-sm">Keep your app and device software up to date with the latest security patches</p>
              </div>
            </div>
          </section>

          {/* Need Help Section */}
          <section className="bg-pink-50 p-6 rounded-xl border border-pink-200">
            <h3 className="text-xl font-bold text-pink-600 mb-4">Need Help?</h3>
            <p className="text-gray-700 mb-4">If you notice any suspicious activity or have security concerns, please contact our support team immediately.</p>
            <div className="space-y-2">
              <p className="text-gray-700"><strong>Email:</strong> support@izhaarlove.com</p>
              <p className="text-gray-700"><strong>Phone:</strong> 7075871167</p>
              <p className="text-gray-700"><strong>Available:</strong> Mon-Sat, 9:00 AM - 8:00 PM IST</p>
            </div>
          </section>

          {/* Footer */}
          <section className="border-t border-gray-200 pt-8 mt-12">
            <p className="text-center text-gray-600 text-sm">
              © 2025 Izhaar Love · Operated by <strong>Imint Financial Solutions</strong>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
