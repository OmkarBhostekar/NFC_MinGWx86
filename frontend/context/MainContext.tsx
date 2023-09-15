'use client'
import { TripType } from "@/types/MainTypes";
import { createContext, useContext, useState } from "react";

const MainContext = createContext({});


export const MainContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [temp, setTemp] = useState<string>("");

  // const [trip, setTrip] = useState<TripType | null>(null);
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
        setUserCoords,
        // trip,
        // setTrip
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => {
  return useContext(MainContext);
};
