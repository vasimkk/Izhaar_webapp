import React, { useState } from 'react';
import F1 from  "../../../src/assets/Flowers/F1.jpg";
import F2 from  "../../../src/assets/Flowers/F2.jpg";
import F3 from  "../../../src/assets/Flowers/F3.jpg";
import F4 from  "../../../src/assets/Flowers/F4.jpg";
import F5 from  "../../../src/assets/Flowers/F5.jpg";
import F6 from  "../../../src/assets/Flowers/F6.jpg";
import F7 from  "../../../src/assets/Flowers/F7.jpg";
import F8 from  "../../../src/assets/Flowers/F8.jpg";
import F9 from  "../../../src/assets/Flowers/F9.jpg";

const Gifts = () => {
  const images = [F1, F2, F3, F4, F5, F6, F7, F8, F9];
  const [selectedImage, setSelectedImage] = useState(null);

  const scrollLeft = () => {
    document.querySelector('.image-carousel').scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    document.querySelector('.image-carousel').scrollBy({ left: 200, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 to-yellow-100">
      {/* Header Section */}
      <header className="bg-pink-500 text-white py-4 px-6 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Welcome to Izhaar Gifts</h1>
          <p className="text-xs sm:text-sm md:text-lg mt-2">
            Discover our curated collection of flowers and gifts to express your feelings in a unique and thoughtful way.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6 text-pink-600">Gifts</h2>
        <p className="text-xs sm:text-sm md:text-lg text-gray-700 text-center mb-4 md:mb-6">
          Explore our curated collection of flowers to express your feelings in a unique and thoughtful way.
        </p>
        <div className="relative flex items-center">
          <button
            className="absolute left-0 z-10 bg-pink-500 text-white rounded-full p-2 shadow-lg"
            onClick={scrollLeft}
          >
            ◀
          </button>
          <div className="image-carousel flex items-center space-x-2 sm:space-x-3 md:space-x-4 overflow-x-auto scrollbar-hide">
            {images.map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-lg cursor-pointer"
                onClick={() => setSelectedImage({ src: image, details: `Flower ${index + 1}` })}
              >
                <img src={image} alt={`Flower ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <button
            className="absolute right-0 z-10 bg-pink-500 text-white rounded-full p-2 shadow-lg"
            onClick={scrollRight}
          >
            ▶
          </button>
        </div>

        {selectedImage && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-lg max-w-xs sm:max-w-sm md:max-w-md w-full mx-4 sm:mx-2">
              <img
                src={selectedImage.src}
                alt={selectedImage.details}
                className="w-full h-auto rounded-lg mb-3 sm:mb-4"
              />
              <h2 className="text-sm sm:text-base md:text-xl font-bold text-center mb-2">{selectedImage.details}</h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 text-center">This is a beautiful flower to express your feelings.</p>
              <button
                className="mt-3 sm:mt-4 px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-2 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600"
                onClick={() => setSelectedImage(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gifts;