// --- REACTJS + TAILWIND VERSION (OPTIMIZED FOR GEMINI-1.5-FLASH) ---
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../../../config/config";
import { useLetter } from "../../../context/LetterContext";

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

    const updated = { ...answers, [step.key]: currentInput };
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
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
        <div className="w-full max-w-xl bg-zinc-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-xl font-bold text-pink-300 mb-4 text-center">
            Letter Ready 💌
          </h2>

          <div className="bg-pink-100 rounded-xl p-6 mb-6 max-h-80 overflow-y-auto">
            <p
              className="text-black whitespace-pre-line"
              style={{ fontFamily: "'Playfair Display', serif" }}

            >
              {generatedLetter}
            </p>
          </div>

          <button
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg mb-3"
            onClick={() => navigate("/user/LetterIzhaar/TemplateScreen")}
          >
            Select Template →
          </button>

          <button
            className="w-full bg-zinc-700 hover:bg-zinc-600 text-gray-200 font-semibold py-3 rounded-lg"
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
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <form
        className="w-full max-w-xl bg-zinc-900 rounded-2xl p-8 shadow-lg"
        onSubmit={(e) => {
          e.preventDefault();
          handleNext();
        }}
      >
        <div className="h-2 bg-gray-700 rounded mb-6 overflow-hidden">
          <div
            className="h-full bg-pink-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <h2 className="text-2xl font-bold text-white mb-4 whitespace-pre-line">
          {step.actorText}
        </h2>

        {step.type === "selection" ? (
          <div className="flex flex-wrap gap-3">
            {step.options.map((option) => (
              <button
                key={option}
                type="button"
                className="px-5 py-3 rounded-full bg-zinc-800 text-white font-semibold hover:bg-zinc-700"
                onClick={() => handleSelectOption(option)}
              >
                {option}
              </button>
            ))}
          </div>
        ) : step.multiline ? (
          <textarea
            className="w-full rounded-lg bg-zinc-800 text-white px-4 py-3 min-h-[120px]"
            placeholder={step.placeholder}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
          />
        ) : (
          <input
            className="w-full rounded-lg bg-zinc-800 text-white px-4 py-3"
            placeholder={step.placeholder}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
          />
        )}

        <div className="flex justify-between items-center mt-6">
          {currentStep > 0 && (
            <button
              type="button"
              className="text-white"
              onClick={handleBack}
            >
              ← Back
            </button>
          )}

          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 py-2 rounded-full"
            disabled={loading}
          >
            {loading ? "Writing..." : "Next →"}
          </button>
        </div>
      </form>
    </div>
  );
}
