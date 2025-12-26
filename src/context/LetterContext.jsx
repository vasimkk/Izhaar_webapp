// LetterContext.js
import React, { createContext, useState, useContext } from "react";

const LetterContext = createContext();

export const LetterProvider = ({ children }) => {
  const [letter, setLetter] = useState("");
  return (
    <LetterContext.Provider value={{ letter, setLetter }}>
      {children}
    </LetterContext.Provider>
  );
};

export const useLetter = () => useContext(LetterContext);
