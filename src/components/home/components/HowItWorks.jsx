import React from "react";
const img1 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Vectors/signup?_a=BAMAOGeA0";
const img2 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Vectors/confess?_a=BAMAOGeA0";
const img3 = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/Vectors/connect?_a=BAMAOGeA0";

const HowItWorks = () => {
    return (
        <section className="mt-20 px-4 mb-20 flex justify-center">
            <div
                className="w-full max-w-[380px] min-h-[724px] rounded-[16px] p-4 flex flex-col border border-white/10"
                style={{
                    background: "linear-gradient(359.78deg, #921251 0.18%, #350465 99.82%), linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))"
                }}
            >
                <h2 className="text-center text-[22px] font-bold mt-4 mb-6 tracking-normal text-white font-['Poppins'] leading-none">
                    How IZHAAR works
                </h2>
                <div className="flex flex-col gap-[30px]">
                    {[
                        {
                            title: "Sign Up on Izhaar",
                            desc: "Sign up on Izhaar and create your profile to get started.",
                            img: img1
                        },
                        {
                            title: "Confess your feelings",
                            desc: "Express your feelings using Izhaar's confession features.",
                            img: img2
                        },
                        {
                            title: "Connect on Izhaar",
                            desc: "If they feel the same, you both get connected.",
                            img: img3
                        }
                    ].map((step, i) => (
                        <div key={i} className="p-6 relative rounded-[24px] flex flex-col items-start text-left group overflow-hidden border border-white/5"
                            style={{
                                background: "rgba(255, 255, 255, 0.03)"
                            }}
                        >
                            {/* Step Number Badge */}
                            <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-bold text-white/40 border border-white/5">
                                {i + 1}
                            </div>

                            {/* Image Container */}
                            <div className="w-[120px] h-[80px] mb-4 flex items-start">
                                <img src={step.img} alt={step.title} className="w-full h-full object-contain object-left" />
                            </div>

                            {/* Text Content */}
                            <div className="space-y-4">
                                <h4 className="text-[20px] font-semibold text-white font-['Outfit'] leading-none tracking-normal">
                                    {step.title}
                                </h4>
                                <p className="text-white/40 text-[14px] font-normal leading-none font-['Outfit'] tracking-normal max-w-[280px]">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
