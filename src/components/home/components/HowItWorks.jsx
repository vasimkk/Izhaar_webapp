import React from "react";
import { FaPaperPlane, FaEyeSlash, FaBell } from "react-icons/fa";

const HowItWorks = () => {
    return (
        <section className="mt-24 px-6 mb-20">
            <div className="bg-[#11081E] rounded-[60px] p-8 py-14 border border-white/[0.08]">
                <h2 className="text-center text-3xl font-black mb-12 uppercase tracking-tighter">How IZHAAR works</h2>
                <div className="space-y-4">
                    {[
                        { title: "Send Your Confession", desc: "Write a secret confession to your crush anonymously.", icon: <FaPaperPlane className="text-[#FF1EAD]" /> },
                        { title: "Relax & Stay Hidden", desc: "We'll keep your identity secret while it is delivered.", icon: <FaEyeSlash className="text-purple-500" /> },
                        { title: "Get Notified", desc: "Get an instant notification if they like you back.", icon: <FaBell className="text-blue-500" /> }
                    ].map((step, i) => (
                        <div key={i} className="p-8 bg-white/[0.03] border border-white/[0.05] rounded-[48px] flex gap-6 items-center relative group">
                            <div className="w-18 h-18 rounded-[30px] bg-white/5 flex-shrink-0 flex items-center justify-center text-2xl">
                                {step.icon}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-[19px] font-black text-white leading-tight mb-1">{step.title}</h4>
                                <p className="text-white/30 text-[11px] leading-snug">{step.desc}</p>
                            </div>
                            <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-white/10" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
