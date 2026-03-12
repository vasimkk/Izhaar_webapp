import React from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaTwitter, FaFacebookF, FaYoutube, FaLinkedinIn } from "react-icons/fa";

const Logo = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/logo?_a=BAMAOGeA0";

const HomeFooter = () => {
    return (
        <footer className="relative mt-20 pt-20 pb-10 px-6 overflow-hidden bg-black/50">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#EC4891]/30 to-transparent" />

            {/* Decorative Glows */}
            <div className="absolute top-[-100px] left-[-10%] w-[300px] h-[300px] bg-[#EC4891]/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-100px] right-[-10%] w-[400px] h-[400px] bg-[#A928ED]/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-screen-xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-2">
                            <img src={Logo} className="h-10" alt="Izhaar" />
                            <span className="text-2xl font-bold font-['Outfit'] text-white">
                                Izhaar<span className="text-[#EC4891]">Love</span>
                            </span>
                        </div>
                        <p className="text-white/60 text-[14px] leading-relaxed max-w-[280px] font-['Outfit']">
                            Join the movement of meaningful connections. Izhaar helps you express the unspoken and build relationships that truly matter.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { Icon: FaInstagram, color: "#E1306C" },
                                { Icon: FaLinkedinIn, color: "#0077B5" },
                                { Icon: FaFacebookF, color: "#1877F2" },
                                { Icon: FaYoutube, color: "#FF0000" }
                            ].map(({ Icon, color }, i) => (
                                <motion.a
                                    key={i}
                                    href="#"
                                    whileHover={{
                                        scale: 1.1,
                                        backgroundColor: "#EC4891",
                                        borderColor: "#EC4891",
                                        color: "#ffffff"
                                    }}
                                    className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-[#EC4891] bg-white/5 backdrop-blur-md transition-all duration-300"
                                >
                                    <Icon size={20} />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links Column 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        <h4 className="text-white font-bold text-lg font-['Poppins']">Our Services</h4>
                        <ul className="space-y-4 text-white/40 text-[14px] font-['Outfit']">
                            {["True Connect", "Secret Crush", "Izhaar Love", "Custom Songs"].map((link) => (
                                <li key={link} className="hover:text-[#EC4891] transition-colors cursor-pointer flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-[#EC4891]/0 group-hover:bg-[#EC4891]" />
                                    {link}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Quick Links Column 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <h4 className="text-white font-bold text-lg font-['Poppins']">Community</h4>
                        <ul className="space-y-4 text-white/40 text-[14px] font-['Outfit']">
                            {["About Izhaar", "How it Works", "Success Stories", "Contact Support"].map((link) => (
                                <li key={link} className="hover:text-[#EC4891] transition-colors cursor-pointer">{link}</li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Quick Links Column 3 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        <h4 className="text-white font-bold text-lg font-['Poppins']">Legal & Privacy</h4>
                        <ul className="space-y-4 text-white/40 text-[14px] font-['Outfit']">
                            {["Privacy Policy", "Terms of Use", "Safety Guidelines", "Cookie Settings"].map((link) => (
                                <li key={link} className="hover:text-[#EC4891] transition-colors cursor-pointer">{link}</li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-white/5 flex flex-col items-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-[12px] font-medium text-white/30 font-['Outfit']">
                            Crafted with ❤️ for real connections
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/10">
                            &copy; 2026 Izhaar Official. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default HomeFooter;
