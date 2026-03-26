import React, { createContext, useContext, useState, ReactNode } from 'react';

type DisplayMode = 'basic' | 'full';

interface DisplayModeContextType {
  globalDisplayMode: DisplayMode;
  setGlobalDisplayMode: (mode: DisplayMode) => void;
}

const DisplayModeContext = createContext<DisplayModeContextType | undefined>(undefined);

interface DisplayModeProviderProps {
  children: ReactNode;
}

export const DisplayModeProvider: React.FC<DisplayModeProviderProps> = ({ children }) => {
  const [globalDisplayMode, setGlobalDisplayMode] = useState<DisplayMode>('basic');

  return (
    <DisplayModeContext.Provider value={{ globalDisplayMode, setGlobalDisplayMode }}>
      {children}
    </DisplayModeContext.Provider>
  );
};

export const useDisplayMode = (): DisplayModeContextType => {
  const context = useContext(DisplayModeContext);
  if (!context) {
    throw new Error('useDisplayMode must be used within DisplayModeProvider');
  }
  return context;
};
