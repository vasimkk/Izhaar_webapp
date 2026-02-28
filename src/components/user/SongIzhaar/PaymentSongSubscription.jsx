import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCheckmarkCircle, IoArrowBack, IoMusicalNotes } from 'react-icons/io5';
import api from '../../../utils/api';
import { useUserId } from '../../../hooks/useUserId';
import SongStepProgress from './SongStepProgress';

const PaymentSongSubscription = () => {
  const userId = useUserId();
  const navigate = useNavigate();
  const location = useLocation();
  const pendingSongData = location.state?.pendingSongData;

  const handlePayment = async () => {
    try {
      // 1. Create order on backend
      const orderPayload = {
        amount: 49900, // ₹499 in paise
        currency: 'INR',
        userId,
        service: 'song',
      };
      const { data: order } = await api.post('/razorpay/order', orderPayload);

      // 2. Open Razorpay checkout
      const options = {
        key: "rzp_live_SFfOOVzkkwjQYg",
        amount: order.amount,
        currency: order.currency,
        name: 'Izhaar',
        description: 'Premium Song Creation',
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            await api.post('/razorpay/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              userId,
              service: 'song',
            });

            // CRITICAL: Now that credit is added, finally create the song request
            if (pendingSongData) {
              await api.post("/music/request", pendingSongData);
            }

            // After successful payment and song creation, navigate to the song list (history) page
            navigate('/user/song/list', { replace: true });
          } catch (err) {
            console.error("Post-payment error:", err);
            alert(err.response?.data?.message || 'Payment verification or song creation failed');
          }
        },
        theme: { color: '#EC4899' }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment initiation failed", error);
      alert("Failed to start payment. Please try again.");
    }
  };

  const features = [
    "Personalized AI-composed Love Song",
    "Professional Vocal & Lyric Generation",
    "Digital Delivery with Private Access",
    "Completely Anonymous Expression",
    "Cinematic Background Visualizer"
  ];

  return (
    <div className="min-h-screen w-full relative overflow-hidden font-inter selection:bg-pink-500/30"
      style={{ background: 'linear-gradient(168deg, #090810 0%, #150D32 49.55%, #260D35 99.09%)' }}>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Header / Nav */}
      <nav className="relative z-50 px-6 pt-6 flex flex-col items-center max-w-7xl mx-auto">
        <div className="w-full flex items-center justify-between mb-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white backdrop-blur-md transition-all"
          >
            <IoArrowBack size={22} />
          </motion.button>
        </div>

        {/* Step Progress Visualizer */}
        <div className="w-full max-w-xl">
          <SongStepProgress currentStep={2} />
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-4 pb-20 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px]"
        >
          {/* Main Card */}
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 md:p-8 shadow-2xl relative overflow-hidden">
            {/* Top Badge */}
            <div className="flex justify-center mb-4">
              <div className="px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px] font-black uppercase tracking-[0.2em]">
                Premium Feature
              </div>
            </div>

            {/* Title */}
            <h1 className="font-playfair text-2xl md:text-3xl font-bold text-white text-center mb-3 leading-tight">
              Unlock Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 italic">Musical Story</span>
            </h1>
            <p className="text-white/40 text-center text-[13px] mb-6 leading-relaxed font-medium">
              Professional-grade AI song that lasts forever.
            </p>

            {/* Price section */}
            <div className="flex items-center justify-center gap-4 mb-6 bg-black/20 py-4 rounded-2xl border border-white/5">
              <div className="flex flex-col items-center">
                <span className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-0.5">Old Price</span>
                <span className="text-lg text-white/20 line-through font-bold">₹999</span>
              </div>
              <div className="w-px h-6 bg-white/10 mx-1" />
              <div className="flex flex-col items-center">
                <span className="text-pink-500 text-[9px] font-black uppercase tracking-widest mb-0.5">Launch Offer</span>
                <span className="text-3xl md:text-4xl font-black text-white tracking-tighter">₹499</span>
              </div>
            </div>

            {/* Features list */}
            <div className="space-y-3 mb-8">
              {features.map((feature, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  key={idx}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-5 h-5 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500 group-hover:bg-pink-500 transition-all group-hover:text-white">
                    <IoCheckmarkCircle size={16} />
                  </div>
                  <span className="text-white/70 text-[13px] font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              className="w-full relative h-[52px] rounded-full flex items-center justify-center gap-3 font-bold text-white shadow-[0_0_20px_rgba(236,72,153,0.3)] overflow-hidden"
              style={{ background: 'linear-gradient(90deg, #EC4899 0%, #8B5CF6 100%)' }}
            >
              <div className="relative flex items-center gap-2">
                <IoMusicalNotes size={20} />
                <span className="text-lg">Start Creating</span>

                {/* Sparkle */}
                <motion.div
                  animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-3"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                  </svg>
                </motion.div>
              </div>
            </motion.button>
            <p className="text-white/20 text-center text-[9px] font-bold mt-4 uppercase tracking-widest">
              Secure Checkout • Razorpay
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PaymentSongSubscription;
