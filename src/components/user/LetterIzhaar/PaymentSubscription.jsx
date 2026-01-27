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
      key: "rzp_test_Rt2p9OZv2KbFMZ", // Replace with your actual Razorpay public key
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
    <div className="min-h-screen w-full overflow-hidden relative">
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col px-4 sm:px-6 py-8"  style={{
          background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)',
          animation: 'gradientShift 15s ease infinite'
        }} >
        {/* Mobile Back Button */}
         {/* Mobile Back Button */}
      <button
        onClick={() => navigate("/user/letter-izhaar")}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95"
        style={{
          background: 'rgba(255, 255, 255, 0.6)',
          border: '1px solid rgba(212, 197, 232, 0.3)',
          boxShadow: '0 4px 12px rgba(45, 27, 78, 0.15)'
        }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={2.5} 
          stroke="currentColor" 
          className="w-5 h-5 text-[#2D1B4E]"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

        <div className="w-full max-w-lg mx-auto">
          {/* Payment Card */}
          <div
            className="rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-lg border border-white/10"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)'
            }}
          >
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-6 leading-tight">
              Unlock Premium letter<br />Izhaar Feature
            </h1>

            {/* Features List */}
            <div className="mb-6 space-y-3">
              <div className="flex items-start gap-3 text-white">
                <span className="text-green-400 mt-1">✓</span>
                <span className="text-sm sm:text-base">Written letter digitally</span>
              </div>
              <div className="flex items-start gap-3 text-white">
                <span className="text-green-400 mt-1">✓</span>
                <span className="text-sm sm:text-base">Delivering online</span>
              </div>
              <div className="flex items-start gap-3 text-white">
                <span className="text-green-400 mt-1">✓</span>
                <span className="text-sm sm:text-base">Without reveling your id</span>
              </div>
              <div className="flex items-start gap-3 text-white">
                <span className="text-green-400 mt-1">✓</span>
                <span className="text-sm sm:text-base">Sending offline for more Trust gaining</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-2xl sm:text-3xl text-gray-400 line-through">199 INR</span>
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">99 INR</span>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              className="w-full rounded-xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-2.5 font-semibold text-xs sm:text-sm md:text-base transition-all shadow-lg text-white hover:opacity-90 mb-4"
               style={{
                background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
                boxShadow: '0 4px 15px 0 rgba(233, 30, 99, 0.4)',
                animation: 'fadeInUp 1s ease-out 0.6s both'
              }}
            >
              Pay Amount
            </button>

            {/* See Plans Link */}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSubscription;