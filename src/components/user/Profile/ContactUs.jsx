import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const ContactUs = () => {
  const navigate = useNavigate();

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
          <h1 className="text-4xl sm:text-5xl font-bold">Contact Us</h1>
          <p className="text-sm opacity-90 mt-2">Get in touch with Izhaar Love</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
          
          {/* Contact Information */}
          <section className="mb-12 bg-gradient-to-r from-pink-50 to-purple-50 p-4 sm:p-6 md:p-8 rounded-xl border border-pink-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-purple-600 mb-6">Contact Information</h2>
            <div className="space-y-6 sm:space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-3">
                <span className="text-2xl sm:text-3xl flex-shrink-0">📧</span>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Email</p>
                  <p className="text-base sm:text-lg font-semibold text-gray-800 break-all">support@izhaarlove.com</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-3">
                <span className="text-2xl sm:text-3xl flex-shrink-0">📞</span>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Phone</p>
                  <p className="text-base sm:text-lg font-semibold text-gray-800">7075871167</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-3">
                <span className="text-2xl sm:text-3xl flex-shrink-0">📍</span>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Location</p>
                  <p className="text-base sm:text-lg font-semibold text-gray-800">Hyderabad India</p>
                </div>
              </div>
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
};

export default ContactUs;