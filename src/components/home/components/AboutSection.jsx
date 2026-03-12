import React from "react";
import { FaUser, FaHeart, FaHandHoldingHeart } from "react-icons/fa";

const AboutSection = () => {
    return (
        <section id="about" className="mt-8 px-6 text-center">
            <h2 className="text-[22px] font-bold mb-4 leading-none font-['Poppins']">We've all been there...</h2>
            <p className="text-white/40 text-[13px] leading-relaxed mb-12 px-6">
                You like someone. You think about them all the time. But when it comes to saying how you feel, the words just don't come out.
            </p>

            <div className="flex justify-center gap-[10px] mb-10 overflow-x-auto pb-4 scrollbar-hide">
                {[
                    { label: "Sign Up", icon: <FaUser /> },
                    { label: "Confess", icon: <FaHandHoldingHeart /> },
                    { label: "Connect", icon: <FaHeart /> }
                ].map((item, i) => (
                    <div
                        key={i}
                        style={{ background: "linear-gradient(89.21deg, rgba(123, 5, 75, 0.15) 0.61%, rgba(53, 4, 101, 0.15) 99.27%)" }}
                        className="w-[85px] h-[85px] border border-white/10 rounded-[16px] p-3 flex flex-col items-center justify-center gap-2 shadow-xl shrink-0"
                    >
                        <div className="text-3xl text-white/80">{item.icon}</div>
                        <span className="text-[11px] font-bold uppercase tracking-tight text-white/60">{item.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AboutSection;
