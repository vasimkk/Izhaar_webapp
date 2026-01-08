import { createContext, useContext, useState } from 'react';

const ReceiverForLetterContext = createContext();

export const ReceiverForLetterProvider = ({ children }) => {
  const [receiverDetails, setReceiverDetails] = useState(null);

  return (
    <ReceiverForLetterContext.Provider value={{ receiverDetails, setReceiverDetails }}>
      {children}
    </ReceiverForLetterContext.Provider>
  );
};

export const useReceiverForLetter = () => useContext(ReceiverForLetterContext);
