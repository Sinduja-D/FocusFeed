import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PreferenceProvider } from './context/PreferenceContext';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PreferenceProvider>
          <App />
        </PreferenceProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);