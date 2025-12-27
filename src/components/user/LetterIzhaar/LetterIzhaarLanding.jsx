import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import letterImg from '../../../assets/images/letter-izhaar-img/image.png';
export default function LetterIzhaarLanding() {
  const navigate = useNavigate();

  const handleGenerate = async () => {
    try {
      const profileRes = await api.get("/auth/user/status");
      if (profileRes.data && profileRes.data.is_active === 0) {
        alert("This feature is for Izhaar members only. Your account is not active.");
        return;
      }
      navigate('/user/letter-izhaar/receiver', { replace: true });
    } catch (err) {
      alert("Could not check user status.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
     
       
      {/* Top half with gradient background */}
      <div className="w-full flex flex-col items-center justify-center min-h-[50vh] bg-gradient-to-b from-[#FF4242] to-black pt-8">
        <img
          src={letterImg}
          alt="Letter Izhaar"
          className="w-[260px] h-[260px] md:w-[350px] md:h-[350px] object-contain mb-4"
        />
        <div className="text-white text-xl md:text-2xl text-center px-6 mb-4 mt-[-10px] pt-1 drop-shadow">Izhaar turns your feelings into beautiful, heartfelt letters—instantly and effortlessly.</div>
      </div>
      {/* Bottom half with black background */}
      <div className="flex-1 w-full bg-black rounded-t-3xl pt-5 pb-0 flex flex-col items-center justify-start relative min-h-[50vh]">
        <div className="w-[90%] bg-black/80 rounded-2xl p-5 mb-6 mt-2 shadow-md">
          <div className="text-white text-base md:text-lg leading-6 whitespace-pre-line">
            {`1. By submitting a letter, you confirm the content belongs to you and does not violate any laws.
2. Once a letter is submitted, it cannot be edited or cancelled.
3. Delivery timelines may vary based on location and availability.
4. Izhaar is not responsible for the receiver's reaction or response.
5. Fees paid for the Letter service are final and non-refundable.`}
          </div>
        </div>
        <button
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold text-lg rounded-xl py-4 px-16 absolute left-6 right-6 bottom-6 shadow-lg"
          onClick={handleGenerate}
        >
          Generate
        </button>
      </div>
    </div>
  );
}
 