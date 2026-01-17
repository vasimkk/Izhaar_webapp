import React from "react";
 const features = [
    { title: "Feature 1", description: "Description of feature 1." },
    { title: "Feature 2", description: "Description of feature 2." },
    { title: "Feature 3", description: "Description of feature 3." },
  ];

  
const FeaturesSection = ({ title, features }) => {
  return (
    <div className="features-section my-12">
      <h2 className="text-2xl font-bold text-center my-6">{title}</h2>
      <div className="features-container grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="feature-card p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;