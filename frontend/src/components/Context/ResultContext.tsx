import React, { createContext, useState, useContext, ReactNode } from "react";
import { VehicleSearchResult } from "@/components/UI/Dashboard/ControlPanel/Options/SearchVehicles";

interface SearchResultsContextProps {
  searchResults: VehicleSearchResult[];
  results?: VehicleSearchResult[];
  setResults?: (results: VehicleSearchResult[]) => void;
  setSearchResults: (results: VehicleSearchResult[]) => void;

}

const SearchResultsContext = createContext<SearchResultsContextProps | undefined>(undefined);

export const SearchResultsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchResults, setSearchResults] = useState<VehicleSearchResult[]>([]);
  return (
    <SearchResultsContext.Provider value={{ searchResults, setSearchResults }}>
      {children}
    </SearchResultsContext.Provider>
  );
};

export const useSearchResults = () => {
  const context = useContext(SearchResultsContext);
  if (!context) {
    throw new Error("useSearchResults must be used within a SearchResultsProvider");
  }
  return context;
};
