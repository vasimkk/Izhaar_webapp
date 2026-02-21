import React from 'react';
import api from '../../../utils/api';
import { useUserId } from '../../../hooks/useUserId';
import { useNavigate } from 'react-router-dom';

const PaymentSubscription = () => {
  const navigate = useNavigate();
  const userId = useUserId();
  const handlePayment = async () => {
    // 1. Create order on backend

    const orderPayload = {
      amount: 9900,
      currency: 'INR',
      userId,
      service: 'letter',
    };
    console.log('Order payload:', orderPayload);
    const { data: order } = await api.post('/razorpay/order', orderPayload);

    // 2. Open Razorpay checkout
    const options = {
      key: "rzp_live_SFfOOVzkkwjQYg", // Replace with your actual Razorpay public key
      amount: order.amount,
      currency: order.currency,
      name: 'Izhaar',
      description: 'Letter Payment',
      order_id: order.id,
      handler: async function (response) {
        // 3. Verify payment on backend (send userId and service)
        try {
          const verifyRes = await api.post('/razorpay/verify', {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            userId,
            service: 'letter',
          });
          // alert('Payment successful! You can now generate your letter.');
          // Optionally, show receipt info: verifyRes.data.payment
          navigate('/user/receiver', { replace: true });
        } catch (err) {
          alert(err.response?.data?.message || 'Payment verification failed');
        }
      },
      theme: { color: '#ff4d6d' }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative" style={{
      background: 'var(--letter, linear-gradient(349deg, #01095E 0%, #000 103.43%))',
      backgroundAttachment: 'fixed'
    }}>

      {/* Ambient Background Lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {[...Array(20)].map((_, i) => {
          const colors = ['rgba(233, 30, 99, 0.4)', 'rgba(156, 39, 176, 0.4)', 'rgba(59, 130, 246, 0.4)'];
          const size = Math.random() * 4 + 2;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const duration = Math.random() * 10 + 10;

          return (
            <div
              key={i}
              className="absolute rounded-full filter blur-[1px]"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                background: colors[Math.floor(Math.random() * colors.length)],
                animation: `float ${duration}s infinite linear`,
                opacity: 0.6
              }}
            />
          );
        })}
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-4 sm:px-6 py-8">

        {/* Mobile Back Button */}
        <button
          onClick={() => navigate("/user/letter-izhaar")}
          className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white shadow-lg active:scale-95 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <div className="w-full max-w-lg mx-auto px-2" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
          {/* Payment Card */}
          <div className="rounded-[2.5rem] p-6 sm:p-10 shadow-2xl backdrop-blur-xl border border-white/5 bg-white/[0.03] relative overflow-hidden group">

            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Title */}
            <h1 className="text-xl sm:text-3xl font-black text-white text-center mb-1 leading-tight tracking-tight">
              Unlock Premium
            </h1>
            <p className="text-[10px] sm:text-xs text-center mb-10 text-white/40 uppercase tracking-[0.3em] font-bold">
              Premium Letter Feature
            </p>

            {/* Features List */}
            <div className="mb-12 space-y-5">
              <div className="flex items-center gap-4 text-white/80 group/feat">
                <div className="bg-[#B72099]/20 text-[#B72099] p-1.5 rounded-full border border-[#B72099]/20 group-hover/feat:scale-110 transition-transform">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-xs sm:text-sm font-bold tracking-wide">Write & Generate AI Letters</span>
              </div>
              <div className="flex items-center gap-4 text-white/80 group/feat">
                <div className="bg-[#B72099]/20 text-[#B72099] p-1.5 rounded-full border border-[#B72099]/20 group-hover/feat:scale-110 transition-transform">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-xs sm:text-sm font-bold tracking-wide">Digital & Anonymous Delivery</span>
              </div>
              <div className="flex items-center gap-4 text-white/80 group/feat">
                <div className="bg-[#B72099]/20 text-[#B72099] p-1.5 rounded-full border border-[#B72099]/20 group-hover/feat:scale-110 transition-transform">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-xs sm:text-sm font-bold tracking-wide">Secure Private Connection</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex flex-col items-center justify-center mb-10">
              <span className="text-xs text-white/20 line-through mb-1 font-bold">WAS ₹199</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter">₹99</span>
                <span className="text-[10px] uppercase font-black text-white/30 tracking-widest">/ Letter</span>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              className="w-full rounded-2xl py-4 font-black text-[11px] uppercase tracking-[0.25em] text-white transition-all duration-300 shadow-[0_20px_40px_rgba(183,32,153,0.3)] hover:shadow-[0_40px_60px_rgba(183,32,153,0.4)] hover:scale-[1.02] active:scale-[0.98] border border-white/20 relative overflow-hidden group/btn"
              style={{
                background: 'linear-gradient(135deg, #FF3F78 0%, #B72099 100%)',
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Unlock Now <span className="animate-pulse">✨</span>
              </span>
            </button>

            <p className="text-center text-white/30 text-xs mt-4">
              Secure payment via Razorpay. One-time fee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSubscription;