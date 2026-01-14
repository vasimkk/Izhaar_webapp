import React from 'react';

const Gifts = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-yellow-100">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-pink-600">Gifts</h1>
        <p className="text-lg text-gray-700 text-center">
          Explore our curated collection of gifts to express your feelings in a unique and thoughtful way.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Example gift items */}
          <div className="p-4 bg-pink-50 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-pink-500">Personalized Mug</h2>
            <p className="text-gray-600">A custom mug with your special message.</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-yellow-500">Photo Frame</h2>
            <p className="text-gray-600">Cherish your memories with a beautiful frame.</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-blue-500">Gift Box</h2>
            <p className="text-gray-600">A box filled with surprises for your loved ones.</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-green-500">Handmade Card</h2>
            <p className="text-gray-600">Express your feelings with a handmade card.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gifts;