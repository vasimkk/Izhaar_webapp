// --- REACTJS + TAILWIND VERSION (OPTIMIZED FOR GEMINI-1.5-FLASH) ---
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../../../config/config";
import { useLetter } from "../../../context/LetterContext";
import bg from "../../../assets/video/Stars_1.mp4";

const STEPS = [
  {
    key: "senderName",
    actorText: "Enter your name that will be mentioned in the letter",
    placeholder: "Type your name...",
    type: "text",
    optional: true,
  },
  {
    key: "receiverName",
    actorText: "Nice to meet you!\nWho are we writing this letter to?",
    placeholder: "e.g. Sarah, Mona, My Love...",
    type: "text",
    optional: false,
  },
  {
    key: "tone",
    actorText: "What kind of letter do you want to send?",
    type: "selection",
    options: [
      "Love letter ❤️",
      "Funny letter 😂",
      "Flirty letter 😉",
      "Sorry letter",
    ],
    optional: false,
  },
  {
    key: "attributes",
    actorText: "Tell me about them.\nWhat do you love the most?",
    placeholder: "e.g. Their smile, kindness, patience...",
    type: "text",
    multiline: true,
    optional: false,
  },
  {
    key: "moment",
    actorText: "Almost done!\nAny special memory to include?",
    placeholder: "e.g. Our first meeting, late-night talks...",
    type: "text",
    multiline: true,
    optional: false,
  },
];

export default function WritePromptScreen() {
  const { setLetter } = useLetter();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentInput, setCurrentInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState(null);

  useEffect(() => {
    const stepKey = STEPS[currentStep]?.key;
    setCurrentInput(answers[stepKey] || "");
  }, [currentStep]);

  const handleNext = () => {
    const step = STEPS[currentStep];
    if (!step.optional && !currentInput && step.type === "text") return;

    const value = step.key === "senderName" && !currentInput ? "Anonymous" : currentInput;
    const updated = { ...answers, [step.key]: value };
    setAnswers(updated);

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateLetter(updated);
    }
  };

  const handleSelectOption = (option) => {
    const clean = option.split(" ")[0];
    const updated = { ...answers, [STEPS[currentStep].key]: clean };
    setAnswers(updated);
    setCurrentInput(clean);

    setTimeout(() => setCurrentStep(currentStep + 1), 250);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSkipSender = () => {
    const updated = { ...answers, senderName: "Anonymous" };
    setAnswers(updated);
    setCurrentInput("Anonymous");
    setCurrentStep(1); // jump to receiver step
  };

  const generateLetter = async (finalAns) => {
    setLoading(true);

    try {
      // 🔥 IMPROVED PROMPT FOR HUMAN-LIKE OUTPUT
      const fullPrompt = `
Write a ${finalAns.tone} letter.

Language rules:
- Use ONLY ONE language
- If the user's input is English, write fully in English
- If the input contains Hinglish/Hindi, write fully in Hinglish
- Do NOT mix languages

Sender: ${finalAns.senderName || "Anonymous"}
Receiver: ${finalAns.receiverName}

What I love about them:
${finalAns.attributes}

Special memory:
${finalAns.moment}

Writing rules:
- Maximum 120 words
- Sound like a real human, not a poem or AI
- Avoid dramatic openings like "My Dearest"
- No forced poetry, shayari, or jokes
- Emotion should feel natural and personal
- Emojis are optional (max 2) only if they feel natural
- Flow like a handwritten letter or WhatsApp message
- Simple, warm, emotionally honest language

The letter must feel genuine, personal, and real.
`;

      const payload = {
        contents: [
          {
            role: "user",
            parts: [{ text: fullPrompt }],
          },
        ],
      };

      const response = await fetch(`${BASE_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.finalLetter) {
        alert("AI could not generate a letter.");
        setLoading(false);
        return;
      }

      setGeneratedLetter(data.finalLetter);
      setLetter(data.finalLetter);
      setLoading(false);
    } catch (err) {
      alert("Failed to generate letter.");
      setLoading(false);
    }
  };

  // ✅ RESULT SCREEN
  if (generatedLetter) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center px-4 pt-12 pb-10 sm:pt-12 sm:pb-12 overflow-hidden">

        <div className="relative w-full max-w-lg bg-white/10 border border-white/15 backdrop-blur-2xl rounded-2xl p-5 sm:p-7 shadow-2xl text-white">
          <h2 className="text-xl sm:text-2xl font-bold text-pink-200 mb-4 text-center">
            Letter Ready 💌
          </h2>

          <div className="bg-white/10 border border-white/20 rounded-xl p-4 sm:p-6 mb-6 max-h-80 overflow-y-auto">
            <p
              className="whitespace-pre-line text-sm sm:text-base text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {generatedLetter}
            </p>
          </div>

          <button
            className="w-full rounded-xl py-3 sm:py-3.5 font-semibold text-white mb-3 shadow-lg hover:opacity-90"
            style={{
              background: 'linear-gradient(90deg, rgba(255, 71, 71, 0.63) 0%, rgba(206, 114, 255, 0.63) 28.65%, rgba(157, 209, 255, 0.63) 68.84%, rgba(255, 210, 97, 0.63) 100%)'
            }}
            onClick={() => navigate("/user/LetterIzhaar/TemplateScreen")}
          >
            Select Template →
          </button>

          <button
            className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl border border-white/20"
            onClick={() => {
              setGeneratedLetter(null);
              setCurrentStep(0);
              setCurrentInput("");
              setAnswers({});
            }}
          >
            Regenerate
          </button>
        </div>
      </div>
    );
  }

  // ✅ FORM UI (UNCHANGED)
  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-12 pb-12 sm:pt-14 sm:pb-14 overflow-hidden">

      <form
        className="relative w-full max-w-2xl bg-white/10 border border-white/15 backdrop-blur-2xl rounded-2xl p-5 sm:p-7 shadow-2xl text-white"
        onSubmit={(e) => {
          e.preventDefault();
          handleNext();
        }}
      >
        <div className="h-2 bg-white/10 rounded mb-6 overflow-hidden">
          <div
            className="h-full"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, rgba(255, 71, 71, 0.63) 0%, rgba(206, 114, 255, 0.63) 28.65%, rgba(157, 209, 255, 0.63) 68.84%, rgba(255, 210, 97, 0.63) 100%)'
            }}
          />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 whitespace-pre-line">
          {step.actorText}
        </h2>

        {step.type === "selection" ? (
          <div className="flex flex-wrap gap-3">
            {step.options.map((option) => (
              <button
                key={option}
                type="button"
                className="px-4 sm:px-5 py-3 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 border border-white/15 transition-all"
                onClick={() => handleSelectOption(option)}
              >
                {option}
              </button>
            ))}
          </div>
        ) : step.multiline ? (
          <textarea
            className="w-full rounded-lg bg-white/5 text-white px-4 py-3 min-h-[140px] border border-white/10 focus:border-pink-400/60 focus:bg-white/10 outline-none transition"
            placeholder={step.placeholder}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
          />
        ) : (
          <input
            className="w-full rounded-lg bg-white/5 text-white px-4 py-3 border border-white/10 focus:border-pink-400/60 focus:bg-white/10 outline-none transition"
            placeholder={step.placeholder}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
          />
        )}

        {step.key === "senderName" && (
          <div className="flex justify-end mt-3">
            <button
              type="button"
              className="text-sm text-pink-200 hover:text-white underline decoration-pink-200/70 decoration-2"
              onClick={handleSkipSender}
            >
              Skip (Anonymous)
            </button>
          </div>
        )}

        <div className="flex justify-between items-center mt-6">
          {currentStep > 0 && (
            <button
              type="button"
              className="text-white hover:text-pink-200 transition"
              onClick={handleBack}
            >
              ← Back
            </button>
          )}

          <button
            type="submit"
            className="rounded-full px-6 py-2 font-bold text-white shadow-lg hover:opacity-90"
            style={{
              background: 'linear-gradient(90deg, rgba(255, 71, 71, 0.63) 0%, rgba(206, 114, 255, 0.63) 28.65%, rgba(157, 209, 255, 0.63) 68.84%, rgba(255, 210, 97, 0.63) 100%)'
            }}
            disabled={loading}
          >
            {loading ? "Writing..." : "Next →"}
          </button>
        </div>
      </form>
    </div>
  );
}
