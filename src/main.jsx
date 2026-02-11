import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ReceiverForLetterProvider } from './context/ReceiverForLetterContext';
import { LetterProvider } from './context/LetterContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="1017299713544-m5ihgketp70o0l1e84uvrc71b0lqpqu9.apps.googleusercontent.com">
    <ReceiverForLetterProvider>
      <LetterProvider>
        <BrowserRouter>
          <AuthProvider>
            <NotificationProvider>
              <App />
              <ToastContainer />
            </NotificationProvider>
          </AuthProvider>
        </BrowserRouter>
      </LetterProvider>
    </ReceiverForLetterProvider>
  </GoogleOAuthProvider>
);

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered:', reg))
      .catch(err => console.error('SW registration failed:', err));
  });
}
