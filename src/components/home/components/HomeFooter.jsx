import React from "react";

const Logo = "https://res.cloudinary.com/df5jbm55b/image/upload/f_auto,q_auto/v1/izhaar/logo?_a=BAMAOGeA0";

const HomeFooter = () => {
    return (
        <footer className="px-10 py-20 text-center opacity-30">
            <img src={Logo} className="h-6 mx-auto mb-6" alt="Izhaar" />
            <p className="text-[9px] font-black uppercase tracking-[0.6em]">&copy; 2026 Izhaar Official</p>
        </footer>
    );
};

export default HomeFooter;
