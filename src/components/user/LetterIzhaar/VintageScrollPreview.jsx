// Vintage Rolled Letter Scroll Preview Component
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../utils/api';
import { useReceiverForLetter } from '../../../context/ReceiverForLetterContext';

export default function VintageScrollPreview({
    isOpen,
    onClose,
    generatedLetter,
    fontFamily,
    fontSize,
    textColor,
    backgroundImage,
    selectedTemplate
}) {
    const [scrollOpened, setScrollOpened] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const navigate = useNavigate();
    const { receiverDetails } = useReceiverForLetter();
    console.log('receiverDetails from context:', receiverDetails);

    if (!isOpen) return null;

    const handleSendLetter = async () => {
        try {
            setSubmitting(true);
            const sender_id = receiverDetails?.sender_id || "USER123";
            const receiver = receiverDetails?.receiver || receiverDetails || {};
            const izhaar_code = receiverDetails?.izhaar_code || "IZHAAR123";

            const payload = {
                izhaar_code,
                sender_id,
                type: "LETTER",
                message: generatedLetter,
                receiver,
                template_id: selectedTemplate,
                font_family: fontFamily,
                font_size: fontSize,
                text_color: textColor,
            };

            console.group('Izhaar Submit Payload');
            console.log('payload:', payload);
            console.log('payload JSON:', JSON.stringify(payload));
            console.log('receiverDetails:', receiverDetails);
            console.log('generatedLetter length:', generatedLetter ? generatedLetter.length : 0);
            console.groupEnd();
            await api.post("/izhaar/submit", payload);

            // After successful letter submission, get latest payment and mark as USED
            try {
                const paymentRes = await api.get("/razorpay/payment-status", {
                    params: { userId: sender_id, service: 'letter' }
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

            // Clear localStorage after successful submission
            localStorage.removeItem('izhaarLetterPreview');
            toast.success("Success ❤️ Letter sent beautifully");
            navigate("/user/dashboard");
        } catch (err) {
            console.error('Submit error status:', err?.response?.status);
            console.error('Submit error data:', err?.response?.data);
            console.error('Submit error message:', err?.message);
            toast.error("Error: " + (err?.response?.data?.message || err.message || "Failed to send letter"));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-start bg-gradient-to-br from-amber-50 via-pink-50 to-purple-50 animate-fadeIn overflow-auto p-2 md:p-4 pt-6">
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>            {/* CLOSED STATE - Vintage Rolled Letter Scroll */}
            {!scrollOpened && (
                <div
                    onClick={() => setScrollOpened(true)}
                    className="cursor-pointer transform hover:scale-105 transition-transform duration-300"
                >
                    {/* Rolled Scroll */}
                    <div className="relative mx-auto" style={{ width: '250px', height: '320px' }}>
                        {/* Scroll Paper - Rolled */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-100 rounded-3xl shadow-2xl border-4 border-amber-200"
                            style={{
                                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(139, 69, 19, 0.03) 10px, rgba(139, 69, 19, 0.03) 20px)',
                            }}
                        >
                            {/* Vintage Paper Texture */}
                            <div className="absolute inset-0 opacity-20" style={{
                                backgroundImage: 'radial-gradient(circle at 20% 50%, transparent 0%, rgba(139, 69, 19, 0.1) 100%)'
                            }} />

                            {/* Wax Seal */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-2xl border-4 border-red-900/30 animate-pulse">
                                    <span className="text-3xl">💕</span>
                                </div>
                            </div>
                        </div>

                        {/* Ribbon - Horizontal */}
                        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-12 z-10">
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-pink-500 to-pink-400 shadow-lg"
                                style={{
                                    clipPath: 'polygon(0 25%, 100% 25%, 100% 75%, 0 75%)'
                                }}
                            />
                            {/* Ribbon Shine */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-black/20"
                                style={{
                                    clipPath: 'polygon(0 25%, 100% 25%, 100% 75%, 0 75%)'
                                }}
                            />
                        </div>

                        {/* Ribbon Bow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                            <div className="relative w-20 h-20">
                                {/* Left Loop */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full shadow-lg transform -rotate-45" />
                                {/* Right Loop */}
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full shadow-lg transform rotate-45" />
                                {/* Center Knot */}
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-pink-500 to-pink-700 rounded-full shadow-xl" />
                                {/* Ribbon Tails */}
                                <div className="absolute left-1/2 top-full -translate-x-1/2 w-5 h-10 bg-gradient-to-b from-pink-500 to-pink-600 shadow-lg transform -rotate-12"
                                    style={{ clipPath: 'polygon(50% 0, 0 100%, 100% 100%)' }}
                                />
                                <div className="absolute left-1/2 top-full -translate-x-1/2 translate-x-3 w-5 h-10 bg-gradient-to-b from-pink-500 to-pink-600 shadow-lg transform rotate-12"
                                    style={{ clipPath: 'polygon(50% 0, 0 100%, 100% 100%)' }}
                                />
                            </div>
                        </div>

                        {/* Decorative Corners */}
                        <div className="absolute top-3 left-3 text-lg opacity-30">🌸</div>
                        <div className="absolute top-3 right-3 text-lg opacity-30">🌸</div>
                        <div className="absolute bottom-3 left-3 text-lg opacity-30">🌸</div>
                        <div className="absolute bottom-3 right-3 text-lg opacity-30">🌸</div>
                    </div>
                </div>
            )}

            {/* OPENED STATE - Letter Preview with Action Buttons */}
            {scrollOpened && (
                <div className="w-full max-w-4xl space-y-4 sm:space-y-6">
                    {/* Action Buttons - Responsive */}
                    <div className="sticky top-4 z-30 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 flex-wrap px-4 py-3 bg-white/80 backdrop-blur rounded-xl shadow-lg">
                        <button
                            onClick={() => setScrollOpened(false)}
                            disabled={submitting}
                            className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-pink-600 rounded-lg sm:rounded-xl font-semibold sm:font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 sm:border-3 border-pink-600 disabled:opacity-60 w-full sm:w-auto"
                        >
                            🎀 Roll Back
                        </button>
                        <button
                            onClick={handleSendLetter}
                            disabled={submitting}
                            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg sm:rounded-xl font-semibold sm:font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-60 w-full sm:w-auto"
                        >
                            {submitting ? '📤 Sending...' : '💌 Send Letter'}
                        </button>
                        <button
                            onClick={() => {
                                setScrollOpened(false);
                                onClose();
                            }}
                            disabled={submitting}
                            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg sm:rounded-xl font-semibold sm:font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-60 w-full sm:w-auto"
                        >
                            ✏️ Edit
                        </button>
                    </div>

                    {/* Letter Preview */}
                    <div className="bg-white rounded-lg sm:rounded-2xl shadow-2xl overflow-hidden border-2 sm:border-4 border-amber-200 animate-fadeIn mx-4 mt-2">
                        {/* Letter Content */}
                        <div
                            className="relative min-h-[400px] sm:min-h-[600px] p-4 sm:p-8 md:p-12"
                            style={{
                                backgroundImage: `url(${backgroundImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                            {/* Overlay for readability */}
                            <div className="absolute inset-0 bg-black/20" />

                            {/* Letter Content with Customizations */}
                            <div className="relative z-10">
                                <p
                                    className="leading-relaxed whitespace-pre-line text-xs sm:text-sm md:text-base"
                                    style={{
                                        fontFamily: fontFamily,
                                        fontSize: `clamp(12px, ${fontSize}px, 24px)`,
                                        color: textColor,
                                        textShadow: textColor === '#ffffff' ? '0 2px 4px rgba(0,0,0,0.4)' : '0 1px 2px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {generatedLetter}
                                </p>
                            </div>

                            {/* Decorative Corners */}
                            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 w-6 sm:w-12 h-6 sm:h-12 border-t-2 sm:border-t-4 border-l-2 sm:border-l-4 border-amber-300/50 rounded-tl-lg" />
                            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-6 sm:w-12 h-6 sm:h-12 border-t-2 sm:border-t-4 border-r-2 sm:border-r-4 border-amber-300/50 rounded-tr-lg" />
                            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 w-6 sm:w-12 h-6 sm:h-12 border-b-2 sm:border-b-4 border-l-2 sm:border-l-4 border-amber-300/50 rounded-bl-lg" />
                            <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 w-6 sm:w-12 h-6 sm:h-12 border-b-2 sm:border-b-4 border-r-2 sm:border-r-4 border-amber-300/50 rounded-br-lg" />
                        </div>
                        <div className="h-1 sm:h-2 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200" />
                    </div>
                </div>
            )}
        </div>
    );
}
