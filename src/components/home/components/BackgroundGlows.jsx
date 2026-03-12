import React from "react";

const BackgroundGlows = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-0 left-[-30%] w-[100%] h-[50%] bg-[#FF1EAD]/10 blur-[120px] rounded-full" />
            <div className="absolute top-[10%] right-[-30%] w-[90%] h-[50%] bg-[#6366F1]/10 blur-[120px] rounded-full" />
        </div>
    );
};

export default BackgroundGlows;
