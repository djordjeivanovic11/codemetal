import React, { createContext, useContext, useState, ReactNode } from "react";

interface VehicleResult {
  timestamp: string;
  tpms_id: string;
  tpms_model: string;
  car_model: string;
  location: string;
  latitude: number;
  longitude: number;
  signal_strength: string;
}

interface VehicleResultsContextProps {
  vehicleResults: VehicleResult[];
  setVehicleResults: (results: VehicleResult[]) => void;
}

const VehicleResultsContext = createContext<VehicleResultsContextProps | undefined>(undefined);

export const VehicleResultsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vehicleResults, setVehicleResults] = useState<VehicleResult[]>([]);

  return (
    <VehicleResultsContext.Provider value={{ vehicleResults, setVehicleResults }}>
      {children}
    </VehicleResultsContext.Provider>
  );
};

export const useVehicleResults = (): VehicleResultsContextProps => {
  const context = useContext(VehicleResultsContext);
  if (!context) {
    throw new Error("useVehicleResults must be used within a VehicleResultsProvider");
  }
  return context;
};
