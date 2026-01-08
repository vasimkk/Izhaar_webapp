
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLetter } from "../../../context/LetterContext";
import bg from "../../../assets/video/Stars_1.mp4";
import bg1 from '../../../assets/temp/letter_01.jpeg';
import bg2 from '../../../assets/temp/letter_02.jpeg';
import bg3 from '../../../assets/temp/letter_03.jpeg';
import bg4 from '../../../assets/temp/letter_04.jpeg';

const templates = [
  { id: "1", title: "Romantic Pink", bg: bg1, border: "border-[#ffb6b9]" },
  { id: "2", title: "Rose Love", bg: bg2, border: "border-[#e75480]" },
  { id: "3", title: "Cute Couple", bg: bg3, border: "border-[#a3d8f4]" },
  { id: "4", title: "Classic Letter", bg: bg4, border: "border-[#deb887]" },
];

export default function TemplateScreen() {
  const navigate = useNavigate();
  const { letter } = useLetter();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = templates.length;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  const handleNext = () => {
    if (!selectedTemplate) return;
    navigate(`/user/LetterIzhaar/final?templateId=${selectedTemplate}&letter=${encodeURIComponent(letter || "")}`);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden">

      <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6 lg:px-10 pt-12 pb-14 text-white">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Select a Love Letter Template</h2>

        {/* Slide indicators */}
        <div className="flex justify-center gap-2 mb-4">
          {templates.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentSlide ? "bg-white w-6" : "bg-white/40 hover:bg-white/60"}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="relative">
          {/* Slider controls */}
          <button
            type="button"
            onClick={prevSlide}
            className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 border border-white/20 shadow-lg"
            aria-label="Previous templates"
          >
            ←
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 border border-white/20 shadow-lg"
            aria-label="Next templates"
          >
            →
          </button>

          {/* Templates slider (one at a time, centered) */}
          <div className="overflow-hidden mb-8">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {templates.map((item, idx) => {
                const isSelected = selectedTemplate === item.id;
                return (
                  <div key={item.id} className="w-full flex-shrink-0 px-4 sm:px-6 flex justify-center">
                    <button
                      onClick={() => setSelectedTemplate(item.id)}
                      className={`relative w-full max-w-sm h-64 sm:h-80 rounded-2xl border-2 overflow-hidden transition-all duration-200 ${item.border} ${isSelected ? "border-4 border-pink-500 shadow-2xl scale-[1.04]" : "hover:scale-[1.02]"}`}
                    >
                      <img 
                        src={item.bg} 
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover brightness-110"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                      <div className="relative h-full flex flex-col items-center justify-end p-4 sm:p-6">
                        <span className="text-lg sm:text-xl font-bold text-center text-white drop-shadow-lg">{item.title}</span>
                        {isSelected && <span className="mt-2 text-green-400 font-bold">✓ Selected</span>}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            className={`mt-2 px-8 py-3 rounded-lg text-lg font-bold text-white transition-all duration-200 shadow-lg ${selectedTemplate ? "hover:opacity-90" : "opacity-60 cursor-not-allowed"}`}
            style={{
              background: 'linear-gradient(90deg, rgba(255, 71, 71, 0.63) 0%, rgba(206, 114, 255, 0.63) 28.65%, rgba(157, 209, 255, 0.63) 68.84%, rgba(255, 210, 97, 0.63) 100%)'
            }}
            disabled={!selectedTemplate}
            onClick={handleNext}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
