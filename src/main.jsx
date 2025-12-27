
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ReceiverForLetterProvider } from './context/ReceiverForLetterContext';
import { LetterProvider } from './context/LetterContext';
import './index.css'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="58928134572-fa7ic98hbkke496t4rmttaeji85m9ttg.apps.googleusercontent.com">
      <ReceiverForLetterProvider>
        <LetterProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </LetterProvider>
      </ReceiverForLetterProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)