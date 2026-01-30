// Vintage Rolled Letter Scroll Preview Component
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
            
            // Wait 2 seconds before navigating to allow toast to display
            setTimeout(() => {
                navigate("/user/izhaar_tracker");
            }, 2000);
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
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                style={{ zIndex: 9999 }}
            />
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-start bg-gradient-to-br from-amber-50 via-pink-50 to-purple-50 animate-fadeIn overflow-auto p-2 md:p-4 pt-6">
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
                
                .envelope-wrapper {
                    perspective: 1000px;
                    cursor: pointer;
                }
                .envelope {
                    position: relative;
                    width: 300px;
                    height: 200px;
                    background: #fdfbf7;
                    box-shadow: 0 10px 30px -5px rgba(0,0,0,0.3);
                    transition: transform 0.3s ease;
                }
                .envelope:hover {
                    transform: translateY(-5px) rotate(1deg);
                }
                
                /* Flap Animation */
                .envelope-flap {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 100px;
                    background: #f2efe9;
                    clip-path: polygon(0 0, 50% 100%, 100% 0);
                    transform-origin: top;
                    transition: transform 0.6s ease-in-out, z-index 0.6s step-end;
                    z-index: 20;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }
                .envelope.open .envelope-flap {
                    transform: rotateX(180deg);
                    z-index: 1;
                }
                
                /* Letter Sliding Animation */
                .letter-preview-card {
                    position: absolute;
                    bottom: 0px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 90%;
                    height: 90%;
                    background: white;
                    border-radius: 4px;
                    overflow: hidden;
                    transition: transform 0.8s ease-in-out 0.4s, bottom 0.8s ease-in-out 0.4s;
                    z-index: 5;
                    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
                }
                .envelope.open .letter-preview-card {
                    transform: translateX(-50%) translateY(-120px) scale(1.05);
                    z-index: 30;
                }

                /* Pocket (Front of Envelope) */
                .envelope-pocket {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 120px;
                    background: #fff;
                    clip-path: polygon(0 0, 50% 40%, 100% 0, 100% 100%, 0 100%);
                    z-index: 10;
                    background: linear-gradient(180deg, #faf9f6 0%, #f0eeea 100%);
                }
                
                /* Wax Seal */
                .wax-seal {
                    position: absolute;
                    top: 90px; /* positioned on the flap tip */
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 25;
                    transition: transform 0.4s ease, opacity 0.4s ease;
                }
                .envelope.open .wax-seal {
                    transform: translate(-50%, -150%) scale(0.5); /* move with flap or fade out */
                    opacity: 0;
                }
            `}</style>

            {/* CLOSED STATE - Realistic Envelope */}
            {!scrollOpened && (
                <div
                    className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn"
                    onClick={() => {
                        // Trigger CSS animation first by adding 'open' class
                        const envelope = document.getElementById('interactive-envelope');
                        if (envelope) envelope.classList.add('open');

                        // Wait for animation then set state
                        setTimeout(() => {
                            setScrollOpened(true);
                        }, 1200);
                    }}
                >
                    <div className="envelope-wrapper py-10">
                        <div id="interactive-envelope" className="envelope mx-auto">
                            {/* The Card Inside (Preview of actual letter) */}
                            <div className="letter-preview-card">
                                <div
                                    className="w-full h-full p-3 opacity-80"
                                    style={{
                                        backgroundImage: `url(${backgroundImage})`,
                                        backgroundSize: 'cover',
                                        fontFamily: fontFamily,
                                        fontSize: '6px', // Tiny preview text
                                        color: textColor,
                                        overflow: 'hidden'
                                    }}
                                >
                                    {generatedLetter}
                                </div>
                            </div>

                            {/* Back of Envelope (Interior) */}
                            <div className="absolute inset-0 bg-[#e6e2d8] z-0" />

                            {/* Front Pocket */}
                            <div className="envelope-pocket"></div>

                            {/* Top Flap */}
                            <div className="envelope-flap">
                                <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent" />
                            </div>

                            {/* Wax Seal */}
                            <div className="wax-seal">
                                <div className="w-12 h-12 rounded-full bg-red-700 shadow-md border-2 border-red-800 flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-full border border-red-600/50 flex items-center justify-center bg-red-700">
                                        <span className="text-xl filter drop-shadow-sm">❤️</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center animate-pulse">
                        <p className="text-pink-600 font-medium text-lg">Tap to open for {receiverDetails?.receiverName || "your love"}</p>
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
                                        fontSize: `${fontSize}px`,
                                        color: textColor,
                                        textShadow: textColor === '#ffffff' ? '0 1px 3px rgba(0,0,0,0.3)' : 'none'
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
        </>
    );
}
