import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import { useUserId } from '../../../hooks/useUserId';
import bgimg from "../../../assets/images/bg.png";

const PaymentSongSubscription = () => {
  const userId = useUserId();
  const navigate = useNavigate();
  const handlePayment = async () => {
    // 1. Create order on backend
    const orderPayload = {
      amount: 49900, // ₹499 in paise
      currency: 'INR',
      userId,
      service: 'song',
    };
    console.log('Order payload:', orderPayload);
    const { data: order } = await api.post('/razorpay/order', orderPayload);

    // 2. Open Razorpay checkout
    const options = {
      key: "rzp_test_Rt2p9OZv2KbFMZ", // Replace with your actual Razorpay public key
      amount: order.amount,
      currency: order.currency,
      name: 'Izhaar',
      description: 'Song Payment',
      order_id: order.id,
      handler: async function (response) {
        // 3. Verify payment on backend (send userId and service)
        try {
          const verifyRes = await api.post('/razorpay/verify', {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            userId,
            service: 'song',
          });
          alert('Payment successful! You can now generate your song.');
          // Optionally, show receipt info: verifyRes.data.payment
        } catch (err) {
          alert(err.response?.data?.message || 'Payment verification failed');
        }
      },
      theme: { color: '#ff4d6d' }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
    rzp.on('payment.success', () => {
      navigate('/user/receiver', { replace: true });
    });
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative">
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-lg">
          {/* Payment Card */}
          <div
            className="rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-lg border border-white/10"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)'
            }}
          >
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-6 leading-tight">
              Unlock Premium Song<br />Izhaar Feature
            </h1>

            {/* Features List */}
            <div className="mb-6 space-y-3">
              <div className="flex items-start gap-3 text-white">
                <span className="text-green-400 mt-1">✓</span>
                <span className="text-sm sm:text-base">Personalized love song created for you</span>
              </div>
              <div className="flex items-start gap-3 text-white">
                <span className="text-green-400 mt-1">✓</span>
                <span className="text-sm sm:text-base">Delivered digitally online</span>
              </div>
              <div className="flex items-start gap-3 text-white">
                <span className="text-green-400 mt-1">✓</span>
                <span className="text-sm sm:text-base">Without revealing your identity</span>
              </div>
              <div className="flex items-start gap-3 text-white">
                <span className="text-green-400 mt-1">✓</span>
                <span className="text-sm sm:text-base">Express emotions through beautiful music</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-2xl sm:text-3xl text-gray-400 line-through">999 INR</span>
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">499 INR</span>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              className="w-full rounded-xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-2.5 font-semibold text-xs sm:text-sm md:text-base transition-all shadow-lg text-white hover:opacity-90 mb-4"
              style={{
                background: 'linear-gradient(90deg, rgba(255, 71, 71, 0.63) 0%, rgba(206, 114, 255, 0.63) 28.65%, rgba(157, 209, 255, 0.63) 68.84%, rgba(255, 210, 97, 0.63) 100%)'
              }}
            >
              Pay &amp; Generate Song
            </button>

            {/* See Plans Link */}
            <div className="text-center">
              <button className="text-white text-sm hover:underline transition-all">
                See ultimate plans
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSongSubscription;
