import React from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaTwitter, FaFacebookF, FaYoutube, FaLinkedinIn } from "react-icons/fa";

const Logo = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/logo?_a=BAMAOGeA0";

const HomeFooter = () => {
    return (
        <footer className="relative mt-20 pt-20 pb-10 px-6 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#EC4891]/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-screen-xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-2">
                            <img src={Logo} className="h-8" alt="Izhaar" />
                            <span className="text-xl font-bold font-['Outfit'] text-white">
                                Izhaar<span className="text-[#EC4891]">Love</span>
                            </span>
                        </div>
                        <p className="text-white/50 text-[14px] leading-relaxed max-w-[250px]">
                            Connect. Confess. Celebrate. Izhaar brings people together through meaningful expressions and personalized romantic experiences.
                        </p>
                        <div className="flex gap-4">
                            {[FaInstagram, FaTwitter, FaFacebookF, FaYoutube].map((Icon, i) => (
                                <motion.a
                                    key={i}
                                    href="#"
                                    whileHover={{ scale: 1.1, color: "#EC4891" }}
                                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <Icon size={18} />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links Column 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        <h4 className="text-white font-bold text-lg">Services</h4>
                        <ul className="space-y-4 text-white/40 text-[14px]">
                            {["True Connect", "Secret Crush", "Izhaar Love", "Custom Songs"].map((link) => (
                                <li key={link} className="hover:text-white transition-colors cursor-pointer">{link}</li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Quick Links Column 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <h4 className="text-white font-bold text-lg">Company</h4>
                        <ul className="space-y-4 text-white/40 text-[14px]">
                            {["About Us", "How it Works", "Success Stories", "Contact"].map((link) => (
                                <li key={link} className="hover:text-white transition-colors cursor-pointer">{link}</li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Quick Links Column 3 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        <h4 className="text-white font-bold text-lg">Legal</h4>
                        <ul className="space-y-4 text-white/40 text-[14px]">
                            {["Privacy Policy", "Terms of Service", "Safety Tips", "Cookie Policy"].map((link) => (
                                <li key={link} className="hover:text-white transition-colors cursor-pointer">{link}</li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-white/5 flex flex-col items-center gap-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">
                        &copy; 2026 Izhaar Official. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default HomeFooter;
