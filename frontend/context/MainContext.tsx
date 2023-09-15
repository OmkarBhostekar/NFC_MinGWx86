'use client'
import { createContext, useContext, useState } from "react";

const MainContext = createContext({});


export const MainContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [temp, setTemp] = useState<string>("");

  const [userCoords, setUserCoords] = useState({
    lat: 19.1645,
    lng: 74.8359
  });
  return (
    <MainContext.Provider
      value={{
        temp,
        setTemp,
        userCoords,
        setUserCoords
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => {
  return useContext(MainContext);
};
