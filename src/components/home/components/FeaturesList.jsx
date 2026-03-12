import React from "react";
import { FaArrowRight } from "react-icons/fa";

// Import Assets
import img1 from "../../../assets/home/img1.png";
import img2 from "../../../assets/home/img2.png";
import img3 from "../../../assets/home/img3.png";
import iphone15 from "../../../assets/home/iPhone 15.png";

const FeaturesList = () => {
    return (
        <section className="mt-32 space-y-32">
            {/* True Connect */}
            <div className="px-6 flex flex-col gap-10">
                <div className="space-y-4">
                    <h2 className="text-[32px] font-black leading-tight">True Connect</h2>
                    <p className="text-white/40 text-[14px] leading-relaxed">
                        The first step to building a real connection is knowing yourself.
                        Take our compatibility test and see who matches your vibe.
                    </p>
                    <button className="flex items-center gap-2 text-[#FF1EAD] font-bold text-sm">
                        Learn More <FaArrowRight />
                    </button>
                </div>
                <div className="relative aspect-square w-full max-w-[320px] mx-auto">
                    <div className="absolute inset-0 bg-blue-500/10 blur-[80px] rounded-full" />
                    <img src={img1} className="w-full h-full object-contain relative z-10 drop-shadow-2xl" />
                </div>
            </div>

            {/* Secret Crush */}
            <div className="px-6 flex flex-col-reverse gap-10">
                <div className="relative aspect-square w-full max-w-[320px] mx-auto">
                    <div className="absolute inset-0 bg-purple-500/10 blur-[80px] rounded-full" />
                    <img src={iphone15} className="w-full h-full object-contain relative z-10 drop-shadow-2xl" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-[32px] font-black leading-tight">Secret Crush</h2>
                    <p className="text-white/40 text-[14px] leading-relaxed">
                        Have a crush on someone from school, college, or anywhere but never had the courage to say it?
                        Send a Secret Crush through Izhaar. If they like you back, you both get notified.
                    </p>
                    <button className="flex items-center gap-2 text-[#FF1EAD] font-bold text-sm">
                        Learn More <FaArrowRight />
                    </button>
                </div>
            </div>

            {/* Izhaar Love */}
            <div className="px-6 flex flex-col gap-10">
                <div className="space-y-4">
                    <h2 className="text-[32px] font-black leading-tight">Izhaar Love</h2>
                    <p className="text-white/40 text-[14px] leading-relaxed">
                        A service where Izhaar expresses your feelings to your crush or loved one on your behalf —
                        perfect for those who are shy, fear rejection, or find it hard to say "I like you" directly. 💌
                    </p>
                    <button className="flex items-center gap-2 text-[#FF1EAD] font-bold text-sm">
                        Learn More <FaArrowRight />
                    </button>
                </div>
                <div className="relative aspect-square w-full max-w-[320px] mx-auto">
                    <div className="absolute inset-0 bg-pink-500/10 blur-[80px] rounded-full" />
                    <img src={img2} className="w-full h-full object-contain relative z-10 drop-shadow-2xl" />
                </div>
            </div>

            {/* Customize a Song */}
            <div className="px-6 flex flex-col-reverse gap-10">
                <div className="relative aspect-square w-full max-w-[320px] mx-auto">
                    <div className="absolute inset-0 bg-indigo-500/10 blur-[80px] rounded-full" />
                    <img src={img3} className="w-full h-full object-contain relative z-10 drop-shadow-2xl" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-[32px] font-black leading-tight">Customize a song</h2>
                    <p className="text-white/40 text-[14px] leading-relaxed">
                        Turn your feelings into a personalized romantic song. Izhaar creates a custom song with your message and sends it to your special person.
                    </p>
                    <button className="flex items-center gap-2 text-[#FF1EAD] font-bold text-sm">
                        Learn More <FaArrowRight />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FeaturesList;
