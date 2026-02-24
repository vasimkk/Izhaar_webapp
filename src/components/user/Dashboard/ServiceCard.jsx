import React from "react";

const ServiceCard = ({ imageUrl, title }) => {
  return (
    <div className="flex-shrink-0 w-64 md:w-80 rounded-[1.5rem] bg-[#1a144e]/40 backdrop-blur-xl border border-white/5 group transition-all duration-500 hover:scale-[1.02] hover:bg-[#1a144e]/60 hover:border-pink-500/40 shadow-2xl relative mt-10">

      {/* Floating Title (No BG / No Border) */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
        <h4 className="px-4 py-1 text-[11px] xs:text-[13px] sm:text-[15px]
                       font-black uppercase whitespace-nowrap
                       tracking-[0.2em] font-['Playfair_Display']
                       text-white/90 group-hover:text-pink-200
                       drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]
                       transition-all duration-500">
          {title}
        </h4>

        {/* Soft glow */}
        <div className="absolute inset-0 blur-md opacity-0 group-hover:opacity-60 transition duration-500 bg-pink-500/20" />
      </div>

      {/* Image */}
      <div className="relative h-56 md:h-64 w-full overflow-hidden rounded-[2rem]">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Button */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <button className="w-full flex justify-center items-center gap-2 bg-white/10 backdrop-blur-md text-white text-[10px] sm:text-[12px] px-4 py-3 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg hover:bg-[#B72099] transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(183,32,153,0.4)]">

            {title === "Watch Party Together" && "Join Party"}
            {title === "Secret Crush" && "Reveal"}
            {title === "Game" && "Play Now"}
            {title === "Letter Izhaar" && "Write Now"}
            {title === "Safe Date" && "Book Now"}
            {title === "Song Izhaar" && "Create Song"}
            {title === "Gifts" && "Browse"}
            {title === "Magazine" && "Explore"}

            <span className="text-[14px]">➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;