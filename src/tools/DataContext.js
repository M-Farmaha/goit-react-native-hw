import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <DataContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);