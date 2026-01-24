import React from 'react';

const ServiceCard = ({ imageUrl, title, description }) => {
  return (
    <div className="flex-shrink-0 w-64 md:w-80 rounded-3xl overflow-hidden shadow-xl bg-white/10 backdrop-blur-lg border border-white/30 group transition-transform duration-300 hover:scale-105">
      <div className="relative h-56 md:h-64 w-full">
        <img
          src={imageUrl}
         
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
         
          {/* Example tags, you can customize or remove */}
          
         <button
  className="w-full mb-3 flex justify-center gap-2 bg-white/20 text-white text-xs  px-4 py-2 rounded-full font-semibold shadow-md hover:bg-white/30 transition"
>
  {title === "Watch Party Together" && "Join Party ➜"}
  {title === "Game" && "Play Game ➜"}
  {title === "Letter Izhaar" && "Write Letter ➜"}
  {title === "Safe Date" && "Book Safe Date ➜"}
  {title === "Song Izhaar" && "Create Song ➜"}
  {title === "Gifts" && "Send Gift ➜"}
  {title === "Magazine" && "Buy Magazine ➜"}
</button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;