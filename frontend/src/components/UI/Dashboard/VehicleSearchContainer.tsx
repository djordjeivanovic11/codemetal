import React, { useState } from "react";
import VehicleSearch, { VehicleSearchResult } from "@/components/UI/Dashboard/ControlPanel/Options/SearchVehicles"; 
import VehicleSearchResults from "@/components/UI/Dashboard/SearchResults";

const VehicleSearchContainer: React.FC = () => {
  const [results, setResults] = useState<VehicleSearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearchResults = (data: VehicleSearchResult[]) => {
    setResults(data);
    setShowResults(true);
  };

  return (
    <>
      <VehicleSearch onSearchResults={handleSearchResults} />
      {showResults && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative bg-[#1a1a1a] p-6 rounded-md w-11/12 max-w-4xl overflow-y-auto max-h-full">
            {/* Close Icon */}
            <button
              onClick={() => setShowResults(false)}
              className="absolute top-2 right-2 text-white text-2xl font-bold hover:underline"
              title="Close Results"
            >
              &times;
            </button>
            <VehicleSearchResults results={results} />
          </div>
        </div>
      )}
    </>
  );
};

export default VehicleSearchContainer;
