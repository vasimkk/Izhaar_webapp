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
    selectedTemplate,
    envelopeColor = '#ff9a9e',
    envelopeDecoration = 'wax_seal'
}) {
    const [scrollOpened, setScrollOpened] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const navigate = useNavigate();
    const { receiverDetails } = useReceiverForLetter();

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
                }
            } catch (err) {
                console.error("Failed to mark payment as USED", err);
            }

            // Clear all localStorage data after successful submission
            localStorage.removeItem('izhaarLetterPreview');
            localStorage.removeItem('izhaarLetterDraft');

            toast.success("Success ❤️ Letter sent beautifully");

            // Wait 2 seconds before navigating to allow toast to display
            setTimeout(() => {
                navigate("/user/izhaar_tracker");
            }, 2000);
        } catch (err) {
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
            {/* Main Container with Dark Premium Theme */}
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-start animate-fadeIn overflow-auto"
                style={{
                    background: 'linear-gradient(349deg, #01095E 0%, #000 103.43%)',
                }}>

                {/* Ambient Background Lights */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen" />
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px] mix-blend-screen" />

                    {/* Multicolor Floating Sparkles */}
                    {[...Array(30)].map((_, i) => {
                        const colors = ['#FFD700', '#FF1493', '#00FFFF', '#FFFFFF', '#7FFF00']; // Gold, DeepPink, Cyan, White, Chartreuse
                        const color = colors[Math.floor(Math.random() * colors.length)];
                        const size = Math.random() * 4 + 2;
                        return (
                            <div
                                key={i}
                                className="absolute rounded-full mix-blend-screen"
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    width: `${size}px`,
                                    height: `${size}px`,
                                    backgroundColor: color,
                                    boxShadow: `0 0 ${size * 2}px ${color}`,
                                    animation: `sparkleFloat ${Math.random() * 4 + 3}s infinite ease-in-out`,
                                    animationDelay: `${Math.random() * 5}s`,
                                }}
                            />
                        );
                    })}
                </div>

                <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes sparkleFloat {
                    0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
                    50% { transform: translateY(-20px) scale(1.5); opacity: 1; filter: brightness(1.5); }
                }
                @keyframes sparkle {
                    0%, 100% { opacity: 0; transform: scale(0.5); }
                    50% { opacity: 1; transform: scale(1.2); filter: drop-shadow(0 0 5px gold); }
                }
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 30px rgba(236, 72, 153, 0.4); }
                    50% { box-shadow: 0 0 60px rgba(236, 72, 153, 0.7); }
                }
                
                .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
                
                .envelope-wrapper {
                    perspective: 1000px;
                    cursor: pointer;
                }
                .envelope {
                    position: relative;
                    width: 320px;
                    height: 220px;
                    box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
                    transition: transform 0.3s ease;
                    border-radius: 4px;
                }
                .envelope:hover {
                    transform: translateY(-5px) scale(1.02);
                }
                
                /* Flap Animation */
                .envelope-flap {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 110px;
                    clip-path: polygon(0 0, 50% 100%, 100% 0);
                    transform-origin: top;
                    transition: transform 0.6s ease-in-out, z-index 0.6s step-end;
                    z-index: 20;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }
                /* Sparkle on Flap */
                .envelope-flap::after {
                    content: '';
                    position: absolute;
                    top: 25px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 14px;
                    height: 14px;
                    background: #fff; /* White core */
                    clip-path: polygon(50% 0%, 65% 40%, 100% 50%, 65% 60%, 50% 100%, 35% 60%, 0% 50%, 35% 40%);
                    animation: sparkle 2s infinite ease-in-out;
                    pointer-events: none;
                    box-shadow: 0 0 10px rgba(255,255,255,0.8);
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
                    height: 130px;
                    clip-path: polygon(0 0, 50% 40%, 100% 0, 100% 100%, 0 100%);
                    z-index: 10;
                    border-top: 1px solid rgba(255,255,255,0.4);
                }
                
                /* Pocket Sparkles */
                .envelope-pocket::before {
                    content: '';
                    position: absolute;
                    bottom: 25px;
                    left: 35px;
                    width: 10px;
                    height: 10px;
                    background: #fff;
                    clip-path: polygon(50% 0%, 65% 40%, 100% 50%, 65% 60%, 50% 100%, 35% 60%, 0% 50%, 35% 40%);
                    animation: sparkle 3s infinite ease-in-out 1s;
                }
                .envelope-pocket::after {
                    content: '';
                    position: absolute;
                    bottom: 45px;
                    right: 35px;
                    width: 12px;
                    height: 12px;
                    background: #fff; /* gold tint can be #FFE5B4 */
                    clip-path: polygon(50% 0%, 65% 40%, 100% 50%, 65% 60%, 50% 100%, 35% 60%, 0% 50%, 35% 40%);
                    animation: sparkle 2.5s infinite ease-in-out 0.5s;
                }

                /* Wax Seal */
                .wax-seal {
                    position: absolute;
                    top: 100px;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 25;
                    transition: transform 0.4s ease, opacity 0.4s ease;
                    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
                }
                .envelope.open .wax-seal {
                    transform: translate(-50%, -150%) scale(0.5);
                    opacity: 0;
                }
            `}</style>

                {/* CLOSED STATE - Realistic Envelope */}
                {!scrollOpened && (
                    <div
                        className="relative z-10 flex flex-col items-center justify-center min-h-[100vh] w-full animate-fadeIn p-4"
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
                        <div className="envelope-wrapper py-10 scale-90 sm:scale-100">
                            <div id="interactive-envelope" className="envelope mx-auto" style={{ backgroundColor: envelopeColor }}>
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
                                <div className="absolute inset-0 z-0" style={{ backgroundColor: envelopeColor, filter: 'brightness(0.9)' }} />

                                {/* Front Pocket */}
                                <div className="envelope-pocket" style={{ backgroundColor: envelopeColor, filter: 'brightness(1.05)' }}></div>

                                {/* Top Flap */}
                                <div className="envelope-flap" style={{ backgroundColor: envelopeColor, filter: 'brightness(1.15)' }}>
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent" />
                                </div>

                                {/* Wax Seal / Decorations */}
                                <div className="absolute inset-0 z-25 flex items-center justify-center pointer-events-none transition-all duration-500 ease-in-out" style={{ transformStyle: 'preserve-3d' }}>
                                    {envelopeDecoration === 'wax_seal' && (
                                        <div className="wax-seal">
                                            <div className="w-12 h-12 rounded-full bg-red-800 shadow-md border-2 border-red-900 flex items-center justify-center overflow-hidden">
                                                <div className="w-10 h-10 rounded-full border border-red-700/50 flex items-center justify-center bg-red-800">
                                                    <span className="text-xl filter drop-shadow-sm">❤️</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {envelopeDecoration === 'string_heart' && (
                                        <div className="absolute inset-0 flex items-center justify-center wax-seal">
                                            <div className="w-full h-1 bg-[#4a3728] shadow-sm" />
                                            <div className="absolute w-12 h-12 bg-red-800 rounded-full border-4 border-red-950 flex items-center justify-center text-xl shadow-xl">❤️</div>
                                        </div>
                                    )}
                                    {envelopeDecoration === 'kisses_stars' && (
                                        <div className="wax-seal text-3xl opacity-80 drop-shadow-lg">💋⭐💋</div>
                                    )}
                                    {envelopeDecoration === 'bow_hearts' && (
                                        <div className="absolute inset-0 flex items-center wax-seal">
                                            <div className="w-10 h-full bg-pink-600 ml-12 opacity-80 shadow-lg" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-center animate-pulse">
                            <p className="text-white/80 font-medium text-lg bg-black/20 px-6 py-2 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
                                Tap to open envelope for {receiverDetails?.receiverName || "your love"}
                            </p>
                        </div>

                        {/* Back button for Closed State */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            className="mt-8 text-white/60 hover:text-white transition-colors flex items-center gap-2 text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                            Back to Edit
                        </button>
                    </div>
                )}

                {/* OPENED STATE - Letter Preview with Action Buttons */}
                {scrollOpened && (
                    <div className="relative z-10 w-full max-w-4xl flex flex-col items-center pt-24 pb-12 px-2 sm:px-4">

                        {/* Header Action Bar (Fixed Top) */}
                        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg transition-all">

                            {/* Roll Back Button (Icon) */}
                            <button
                                onClick={() => setScrollOpened(false)}
                                disabled={submitting}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10 active:scale-95"
                                title="Back"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>

                            {/* Title */}
                            <h3 className="text-white font-bold text-lg tracking-wide opacity-90">Letter Preview</h3>

                            <div className="flex items-center gap-3">
                                {/* Edit Button (Icon) */}
                                <button
                                    onClick={() => {
                                        setScrollOpened(false);
                                        onClose();
                                    }}
                                    disabled={submitting}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10 active:scale-95"
                                    title="Edit"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                    </svg>
                                </button>

                                {/* Send Button (Icon + Text Pill) */}
                                <button
                                    onClick={handleSendLetter}
                                    disabled={submitting}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full font-bold text-sm shadow-[0_0_15px_rgba(236,72,153,0.5)] hover:shadow-[0_0_25px_rgba(236,72,153,0.7)] transition-all active:scale-95 border border-white/10 hover:scale-105"
                                >
                                    {submitting ? "..." : (
                                        <>
                                            <span>Send</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Letter Preview */}
                        <div className="w-full max-w-[380px] bg-white shadow-2xl overflow-hidden animate-fadeIn relative">
                            {/* Letter Content */}
                            <div
                                className="relative min-h-[500px] sm:min-h-[700px] p-6 sm:p-10 md:p-14"
                                style={{
                                    backgroundImage: `url(${backgroundImage})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                {/* Overlay for readability */}
                                <div className="absolute inset-0 bg-black/5" />

                                {/* Letter Content with Customizations */}
                                <div className="relative z-10">
                                    <p
                                        className="leading-relaxed whitespace-pre-line text-xs sm:text-sm md:text-base lg:text-lg text-left"
                                        style={{
                                            fontFamily: fontFamily,
                                            fontSize: `${fontSize}px`,
                                            color: textColor,
                                            textShadow: textColor === '#ffffff' ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
                                            padding: '4rem 0 2rem 0'
                                        }}
                                    >
                                        {generatedLetter}
                                    </p>
                                </div>

                                {/* Decorative Corners */}
                                <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-primary/20 rounded-tl-lg pointer-events-none" />
                                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-primary/20 rounded-tr-lg pointer-events-none" />
                                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-primary/20 rounded-bl-lg pointer-events-none" />
                                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-primary/20 rounded-br-lg pointer-events-none" />
                            </div>
                            <div className="h-2 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200" />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
