import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Import local character assets
import girlImg from "../../../assets/cta/girl.png";
import boyImg from "../../../assets/cta/boy.png";

const ConfessionCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="px-6 py-20  text-center overflow-hidden">
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-[26px] font-bold text-white leading-[1.1] mb-12 font-['Poppins']"
      >
        Your <span className="text-[#EC4891]">Love Story</span> Could<br />Start Today
      </motion.h2>

      {/* Visual Section */}
      <div className="relative max-w-[280px] mx-auto h-[260px] mb-12 pt-4">
        {/* Left Card (Girl) */}
        <motion.div
          initial={{ opacity: 0, x: -30, rotate: -15 }}
          whileInView={{ opacity: 1, x: 0, rotate: -10 }}
          animate={{
            y: [0, -10, 0],
            rotate: [-10, -11, -10]
          }}
          whileHover={{ scale: 1.02 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute left-0 top-4 w-[125px] h-[165px] bg-[#3B0726] rounded-[24px] border-[2.5px] border-white shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-10"
        >
          {/* Internal container for image to handle overflow without cutting overlapping circles */}
          <div className="w-full h-full rounded-[21px] overflow-hidden flex items-center justify-center">
            <img src={girlImg} alt="Girl" className="w-full h-full object-contain" />
          </div>

          {/* Boy Circle Overlap (Top Left) */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-5 -left-5 w-14 h-14 rounded-full border-[2px] border-white overflow-hidden shadow-lg z-20 bg-[#1E0B3E]"
          >
            <img src={boyImg} alt="Boy" className="w-full h-full object-contain p-1" />
          </motion.div>
        </motion.div>

        {/* Right Card (Boy) */}
        <motion.div
          initial={{ opacity: 0, x: 30, rotate: 15 }}
          whileInView={{ opacity: 1, x: 0, rotate: 10 }}
          animate={{
            y: [0, 10, 0],
            rotate: [10, 9, 10]
          }}
          whileHover={{ scale: 1.02 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
            delay: 0.1,
            y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
            rotate: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
          }}
          className="absolute right-0 top-12 w-[125px] h-[165px] bg-[#1E0B3E] rounded-[24px] border-[2.5px] border-white shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-10"
        >
          {/* Internal container for image */}
          <div className="w-full h-full rounded-[21px] overflow-hidden flex items-center justify-center">
            <img src={boyImg} alt="Boy" className="w-full h-full object-contain" />
          </div>

          {/* Girl Circle Overlap (Bottom Right) */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-5 -right-5 w-14 h-14 rounded-full border-[2px] border-white overflow-hidden shadow-lg z-20 bg-[#3B0726]"
          >
            <img src={girlImg} alt="Girl" className="w-full h-full object-contain p-1" />
          </motion.div>
        </motion.div>
      </div>

      {/* Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-[280px] mx-auto mb-12"
      >
        <p className="text-white font-bold text-[16px] leading-[22px] text-center font-['Outfit']">
          "Many people regret never telling their crush how they feel. Don't let that be your story."
        </p>
      </motion.div>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/user/dashboard")}
        className="w-[200px] py-4 rounded-full text-white font-semibold text-[16px] leading-none text-center font-['Poppins'] shadow-[0_10px_20px_rgba(233,30,99,0.3)] transition-all"
        style={{
          background: "linear-gradient(90deg, #E91E63 0%, #A928ED 100%)"
        }}
      >
        Confession Now
      </motion.button>
    </section>
  );
};

export default ConfessionCTA;
