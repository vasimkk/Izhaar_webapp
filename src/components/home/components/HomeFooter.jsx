import React from "react";
import { motion } from "framer-motion";
import {
    FaInstagram,
    FaFacebookF,
    FaLinkedinIn,
    FaWhatsapp,
    FaEnvelope,
    FaPhoneAlt,
    FaRss
} from "react-icons/fa";

const Logo = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/logo?_a=BAMAOGeA0";

const HomeFooter = () => {
    return (
        <footer className="relative mt-10 pt-5 pb-5 px-6 bg-black text-white font-['Outfit'] border-t border-white/5">
            <div className="max-w-[1200px] mx-auto w-full flex flex-col items-start gap-12">

                {/* Brand Section */}
                <div className="w-full space-y-5">
                    <div className="flex items-center gap-3">
                        <img src={Logo} className="h-10 w-10 object-contain" alt="Izhaar" />
                        <span className="text-2xl font-bold font-['Poppins'] tracking-tight">
                            Izhaar<span className="text-[#EC4891] ml-1">Love</span>
                        </span>
                    </div>
                    <p className="text-white/50 text-[14px] leading-relaxed max-w-[480px]">
                        Empowering you to express your feelings with clarity and confidence. Our tools and community help you master the art of connection and build relationships that last.
                    </p>
                </div>

                {/* Grid Layout for Desktop, Flex for Mobile */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h4 className="text-[16px] font-bold font-['Poppins'] text-white uppercase tracking-wider">Contact Information</h4>
                        <div className="space-y-3">
                            <a href="mailto:services@izhaarlove.com" className="flex items-center gap-3 text-white/50 transition-colors hover:text-[#EC4891] group">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#EC4891]/10 transition-colors">
                                    <FaEnvelope className="text-[#EC4891] text-xs" />
                                </div>
                                <span className="text-[14px]">support@izhaarlove.com</span>
                            </a>
                            <a href="tel:+917075871167" className="flex items-center gap-3 text-white/50 transition-colors hover:text-[#EC4891] group">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#EC4891]/10 transition-colors">
                                    <FaPhoneAlt className="text-[#EC4891] text-xs" />
                                </div>
                                <span className="text-[14px]">+91 70758 71167</span>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-[16px] font-bold font-['Poppins'] text-white uppercase tracking-wider">Quick Links</h4>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-8">
                            {[
                                { name: "Home", link: "/" },
                                { name: "FAQ's", link: "/faqs" },
                                { name: "About Us", link: "/about-us" },
                                { name: "Help", link: "/help" },
                                { name: "Services", link: "/user/dashboard" },
                                { name: "Support", link: "/support" },
                                { name: "AI Coach", link: "/user/ai-coach" },
                                { name: "Privacy Policy", link: "/privacy_policy" },
                                { name: "Community", link: "/community" },
                                { name: "Disclaimer", link: "/disclaimer" }
                            ].map((link) => (
                                <a
                                    key={link.name}
                                    href={link.link}
                                    className="text-white/40 text-[14px] hover:text-[#EC4891] transition-colors py-1 block"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Subscription & Socials */}
                    <div className="space-y-8">
                        {/* Get In Touch */}
                        <div className="space-y-4">
                            <h4 className="text-[16px] font-bold font-['Poppins'] text-white uppercase tracking-wider">Get In Touch</h4>
                            <div className="relative w-full max-w-[320px]">
                                <div className="flex items-center bg-[#111111] rounded-full p-1 border border-white/5 shadow-inner">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="bg-transparent border-none outline-none flex-1 px-4 text-[13px] text-white placeholder:text-white/20 min-w-0"
                                    />
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center justify-center gap-2 h-9 px-5 rounded-full text-[12px] font-bold bg-gradient-to-r from-[#EC4891] to-[#A928ED] shadow-lg whitespace-nowrap shrink-0"
                                    >
                                        <FaRss size={10} className="rotate-45" />
                                        Subscribe
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        {/* Follow Us */}
                        <div className="space-y-4">
                            <h4 className="text-[16px] font-bold font-['Poppins'] text-white uppercase tracking-wider">Follow Us</h4>
                            <div className="flex gap-3">
                                {[
                                    { Icon: FaInstagram, color: "#E1306C", link: "https://www.instagram.com/izhaar.official7?igsh=MWJjNDlic2U4djU2eg==" },
                                    { Icon: FaWhatsapp, color: "#25D366", link: "https://wa.me/917075871167" },
                                    { Icon: FaFacebookF, color: "#1877F2", link: "#" },
                                    { Icon: FaLinkedinIn, color: "#0077B5", link: "#" },
                                ].map(({ Icon, color, link }, i) => (
                                    <motion.a
                                        key={i}
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ y: -3, scale: 1.1 }}
                                        className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-black hover:shadow-xl transition-all"
                                        style={{ color: color }}
                                    >
                                        <Icon size={16} />
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="w-full pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center ">
                    <p className="text-[12px] text-white/20 text-center md:text-left">
                        &copy; 2026 Izhaar Official. Dedicated to unspoken feelings.
                    </p>
                    <div className="flex gap-6">
                        <a href="/terms" className="text-[11px] text-white/20 hover:text-white transition-colors">Terms</a>
                        <a href="/privacy" className="text-[11px] text-white/20 hover:text-white transition-colors">Privacy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default HomeFooter;
