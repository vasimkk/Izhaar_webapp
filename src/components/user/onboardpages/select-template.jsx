// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../../utils/api";
// import codeImg from "../../../assets/images/welcome/code.png";
// import complimentImg from "../../../assets/images/welcome/compliment.png";
// import confessImg from "../../../assets/images/welcome/confess.png";
// import exploreImg from "../../../assets/images/welcome/explore.png";

// export default function SelectTemplate() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [selectedTemplate, setSelectedTemplate] = useState(null);

//   const templates = [
//     {
//       id: 1,
//       title: "I want to confess my feelings",
//       description: "Express your heartfelt emotions",
//       img: confessImg,
//     },
//     {
//       id: 2,
//       title: "I received an IZHAAR code",
//       description: "Open a confession sent to you",
//       img: codeImg,
//     },
//     {
//       id: 3,
//       title: "I want to compliment a friend",
//       description: "Appreciate someone special",
//       img: complimentImg,
//     },
//     {
//       id: 4,
//       title: "I want to explore",
//       description: "Discover what Izhaar can do",
//       img: exploreImg,
//     },
//   ];

//   const handleTemplateSelect = async (template) => {
//     setSelectedTemplate(template.id);
//     try {
//       setLoading(true);
//       const response = await api.post("/user/template-selection", {
//         templateId: template.id,
//         templateTitle: template.title,
//       });
//       // Navigate to dashboard with replace to prevent back navigation
//       navigate("/user/dashboard", { replace: true });
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to save selection");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-4 py-10">
//       {/* Background image */}
//       <div className="fixed inset-0 -z-10">
//         <div 
//         className="fixed inset-0 -z-10"
//         style={{
//           background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)',
//           animation: 'gradientShift 15s ease infinite'
//         }}
//       ></div>
//       </div>
//       <div className="w-full max-w-5xl mx-auto">
//         {/* HEADER */}
//         <div className="pt-10 px-5 pb-2 flex flex-col items-center text-center gap-2">
          
//           <h3 className="text-lg md:text-lg text-[#6B5B8E] ">Happy to see you here! What inspired your visit?</h3>
//         </div>
//         {/* TEMPLATE OPTIONS */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full px-2">
//           {templates.map((template) => (
//             <button
//               key={template.id}
//               className={`group relative flex flex-col rounded-3xl p-4 overflow-hidden shadow-2xl border transition-all duration-300 ${
//                 selectedTemplate === template.id
//                   ? 'ring-2 ring-pink-400/70 scale-[1.02] border-pink-500'
//                   : 'hover:scale-[1.02] border-transparent'
//               }`}
//               onClick={() => handleTemplateSelect(template)}
//               disabled={loading}
//             >
//               <div className="relative w-full h-48 sm:h-56 lg:h-64 overflow-hidden rounded-2xl">
//                 <img src={template.img} alt={template.title} className="w-full h-full object-cover" />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
//                 <div className="absolute bottom-3 left-4 text-left text-white drop-shadow-lg">
                 
//                 </div>
//               </div>
//               <div className="mt-4 w-full text-left flex items-center justify-between">
//                 <div>
                
//                 </div>
//                 {selectedTemplate === template.id && (
//                   <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">Selected</span>
//                 )}
//               </div>
//               {loading && selectedTemplate === template.id && (
//                 <div className="absolute inset-0 bg-black/30  flex items-center justify-center">
//                   <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
//                 </div>
//               )}
//             </button>
//           ))}
//         </div>
//         {/* INFO TEXT */}
//         <p className="text-center text-sm  text-black mt-5 px-6 leading-5">Your selection helps us personalize your Izhaar experience</p>
//       </div>
//     </div>
//   );
// }
//new code__
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import codeImg from "../../../assets/images/welcome/code.png";
import complimentImg from "../../../assets/images/welcome/compliment.png";
import confessImg from "../../../assets/images/welcome/confess.png";
import exploreImg from "../../../assets/images/welcome/explore.png";

export default function SelectTemplate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: 1,
      title: "I want to confess my feelings",
      description: "Express your heartfelt emotions",
      img: confessImg,
      buttonText: "Confess Feelings ➜"
    },
    {
      id: 2,
      title: "I received an IZHAAR code",
      description: "Open a confession sent to you",
      img: codeImg,
      buttonText: "Open Code ➜"
    },
    {
      id: 3,
      title: "I want to compliment a friend",
      description: "Appreciate someone special",
      img: complimentImg,
      buttonText: "Compliment Friend ➜"
    },
    {
      id: 4,
      title: "I want to explore",
      description: "Discover what Izhaar can do",
      img: exploreImg,
      buttonText: "Explore Now ➜"
    },
  ];

  const handleTemplateSelect = async (template) => {
    setSelectedTemplate(template.id);
    try {
      setLoading(true);
      const response = await api.post("/user/template-selection", {
        templateId: template.id,
        templateTitle: template.title,
      });
      navigate("/user/dashboard", { replace: true });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save selection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-4 py-10">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="fixed inset-0 -z-10"
          style={{
            background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)',
            animation: 'gradientShift 15s ease infinite'
          }}
        ></div>
      </div>

      <div className="w-full max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="pt-6 md:pt-10 px-4 md:px-5 pb-6 md:pb-8 flex flex-col items-center text-center gap-2">
          <h3 className="text-base md:text-lg lg:text-xl text-[#6B5B8E] font-medium">
            Happy to see you here! What inspired your visit?
          </h3>
        </div>

        {/* TEMPLATE OPTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full px-2 md:px-4">
          {templates.map((template) => (
            <div key={template.id} className="flex flex-col gap-4">
              {/* Card */}
              <div className="  overflow-hidden  transition-all">
                <div className="relative h-52 sm:h-60 md:h-72 w-full overflow-hidden">
                  <img
                    src={template.img}
                    alt={template.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              {/* Button */}
              <button
                onClick={() => handleTemplateSelect(template)}
                disabled={loading && selectedTemplate === template.id}
                className={`relative w-full flex justify-center items-center gap-2 px-4 py-3 rounded-full font-semibold text-sm md:text-base shadow-lg transition-all duration-300 overflow-hidden group ${
                  selectedTemplate === template.id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white ring-2 ring-pink-400'
                    : 'bg-gradient-to-r from-white/80 to-white/60 text-gray-800 hover:from-white/90 hover:to-white/70 backdrop-blur-md border border-white/40'
                }`}
              >
                {/* Shimmer Effect */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
                  style={{ width: '50%' }}
                ></div>

                {/* Button Content */}
                <span className="relative z-10 flex items-center gap-2">
                  {loading && selectedTemplate === template.id ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                      Loading...
                    </>
                  ) : selectedTemplate === template.id ? (
                    <>Selected ✓</>
                  ) : (
                    template.buttonText
                  )}
                </span>
              </button>
            </div>
          ))}
        </div>

        {/* INFO TEXT */}
        <p className="text-center text-xs md:text-sm text-gray-700 mt-8 md:mt-10 px-4 md:px-6 leading-relaxed">
          Your selection helps us personalize your Izhaar experience
        </p>
      </div>
    </div>
  );
}