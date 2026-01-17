import React from 'react';

const ServiceCard = ({ imageUrl, title }) => {
  return (
    <div className="flex-shrink-0 w-48 md:w-64 text-center group transform transition-transform duration-300 hover:scale-105">
      <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-48 md:h-64 object-cover transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white text-lg md:text-xl font-bold truncate">{title}</h3>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
