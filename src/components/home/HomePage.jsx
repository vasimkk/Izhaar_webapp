
import React from "react";
import Header from "../header/Header";
import bgimg from "../../assets/images/bgimg.png";

const HomePage = () => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-x-hidden">
      {/* Background image with blur */}
      <div className="fixed inset-0 -z-10">
        <img
          src={bgimg}
          alt="Background"
          className="w-full h-full object-cover object-center blur-md brightness-110"
        />
        <div className="absolute inset-0 bg-white/10" />
      </div>
      <Header />
      {/* Add more homepage content here */}
    </div>
  );
};

export default HomePage;
