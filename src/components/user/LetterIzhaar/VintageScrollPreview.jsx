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
                </div>

                <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .paper-texture {
                    background-image: url("https://www.transparenttextures.com/patterns/natural-paper.webp");
                    background-size: contain;
                }

                .envelope-wrapper {
                    perspective: 2000px;
                    cursor: pointer;
                }

                .envelope {
                    position: relative;
                    width: 340px;
                    height: 230px;
                    background: #fff;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.4);
                    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    border-radius: 4px;
                    transform-style: preserve-3d;
                }

                .envelope:hover {
                    transform: translateY(-10px) rotateX(5deg);
                }

                /* Flap Animation */
                .envelope-flap {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 115px;
                    clip-path: polygon(0 0, 50% 100%, 100% 0);
                    transform-origin: top;
                    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), z-index 0.8s step-end;
                    z-index: 40;
                    filter: brightness(1.1);
                    backface-visibility: hidden;
                }

                .envelope.open .envelope-flap {
                    transform: rotateX(180deg);
                    z-index: 1;
                }

                /* Letter Sliding Animation */
                .letter-preview-card {
                    position: absolute;
                    bottom: 10px;
                    left: 5%;
                    width: 90%;
                    height: 85%;
                    background: white;
                    border-radius: 4px;
                    overflow: hidden;
                    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s, bottom 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
                    z-index: 5;
                    box-shadow: 0 -5px 15px rgba(0,0,0,0.1);
                }

                .envelope.open .letter-preview-card {
                    transform: translateY(-130px) scale(1.08);
                    z-index: 50;
                }

                /* Pocket Layers */
                .pocket-side-left {
                    position: absolute;
                    inset: 0;
                    background: inherit;
                    clip-path: polygon(0 0, 50% 50%, 0 100%);
                    z-index: 20;
                    filter: brightness(1.05);
                }

                .pocket-side-right {
                    position: absolute;
                    inset: 0;
                    background: inherit;
                    clip-path: polygon(100% 0, 50% 50%, 100% 100%);
                    z-index: 20;
                    filter: brightness(1.05);
                }

                .envelope-pocket-bottom {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 140px;
                    background: inherit;
                    clip-path: polygon(0 100%, 100% 100%, 50% 45%);
                    z-index: 30;
                    filter: brightness(0.95);
                    border-top: 1px solid rgba(255,255,255,0.1);
                }

                /* Wax Seal */
                .wax-seal {
                    position: absolute;
                    top: 115px;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 45;
                    transition: transform 0.5s ease-in-out, opacity 0.4s ease;
                }

                .envelope.open .wax-seal {
                    transform: translate(-50%, -180%) scale(0.5);
                    opacity: 0;
                }

                .wax-seal-inner {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: #8B0000;
                    border: 4px solid #5C0000;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.4), inset 0 0 10px rgba(0,0,0,0.5);
                    display: flex;
                    items-center;
                    justify-content: center;
                    position: relative;
                }

                .wax-seal-inner::before {
                    content: '❤️';
                    font-size: 20px;
                    filter: drop-shadow(0 2px 2px rgba(0,0,0,0.4));
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
                                <div className="absolute inset-0 paper-texture opacity-20 pointer-events-none" />

                                {/* The Card Inside */}
                                <div className="letter-preview-card shadow-inner">
                                    <div
                                        className="w-full h-full p-3 opacity-90"
                                        style={{
                                            backgroundImage: `url(${backgroundImage})`,
                                            backgroundSize: 'cover',
                                            fontFamily: fontFamily,
                                            fontSize: '6px',
                                            color: textColor,
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <div className="paper-texture absolute inset-0 opacity-10" />
                                        {generatedLetter}
                                    </div>
                                </div>

                                {/* Back Face */}
                                <div className="absolute inset-0 bg-black/10 z-0" />

                                {/* Side Folds */}
                                <div className="pocket-side-left" style={{ backgroundColor: envelopeColor }}>
                                    <div className="absolute inset-0 paper-texture opacity-20" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                                </div>
                                <div className="pocket-side-right" style={{ backgroundColor: envelopeColor }}>
                                    <div className="absolute inset-0 paper-texture opacity-20" />
                                    <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-transparent" />
                                </div>

                                {/* Bottom Fold */}
                                <div className="envelope-pocket-bottom" style={{ backgroundColor: envelopeColor }}>
                                    <div className="absolute inset-0 paper-texture opacity-30" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                                </div>

                                {/* Top Flap */}
                                <div className="envelope-flap" style={{ backgroundColor: envelopeColor }}>
                                    <div className="absolute inset-0 paper-texture opacity-30" />
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10" />
                                </div>

                                {/* Wax Seal */}
                                <div className="wax-seal">
                                    <div className="wax-seal-inner">
                                        <div className="absolute inset-0 bg-white/5 blur-[1px] rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="text-center w-full max-w-[280px]">
                            <p className="text-white font-bold text-lg bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-3.5 rounded-2xl shadow-xl shadow-pink-500/20 active:scale-95 transition-all cursor-pointer">
                                Continue to send ➜
                            </p>
                        </div>
                        <div className="mt-12 flex flex-col items-center gap-3">
                            <p className="text-white/30 text-[10px] uppercase tracking-[3px] font-medium">Want to change envelope style?</p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose();
                                }}
                                className="mb-4 px-6 py-2.5  hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm shadow-2xl active:scale-95 group"
                            >
                                <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent font-bold flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-pink-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                    </svg>
                                    Back to Edit
                                </span>
                            </button>
                        </div>
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

