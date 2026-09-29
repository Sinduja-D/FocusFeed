import React, { createContext, useContext, useState } from 'react';

const PreferenceContext = createContext();

export const PreferenceProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    focusMode: 'Technology',
    discoveryLevel: 'Balanced',
    interests: []
  });

  const updatePreferences = (newPreferences) => {
    setPreferences(prev => ({
      ...prev,
      ...newPreferences
    }));
  };

  return (
    <PreferenceContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </PreferenceContext.Provider>
  );
};

export const usePreferences = () => useContext(PreferenceContext);

export default PreferenceContext;