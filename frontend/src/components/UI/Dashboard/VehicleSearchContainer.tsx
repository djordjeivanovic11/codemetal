import React, { useState } from "react";
import VehicleSearch, { VehicleSearchResult } from "@/components/UI/Dashboard/ControlPanel/Options/SearchVehicles"; 
import VehicleSearchResults from "@/components/UI/Dashboard/SearchResults";
import ResultsDisplay from "@/components/UI/Dashboard/ResultsDisplay";
import { VehicleResultsProvider } from "@/components/Context/ResultContext";
import { GraphResponse, NetworkResponse } from "@/api/visualize/route";

const VehicleSearchContainer: React.FC = () => {
  const [results, setResults] = useState<VehicleSearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  // State for the algorithm results. In a real scenario, these might be obtained from an API call.
  const [graphResponse] = useState<GraphResponse | null>(null);
  const [networkResponse] = useState<NetworkResponse | null>(null);

  const handleSearchResults = (data: VehicleSearchResult[]) => {
    setResults(data);
    setShowResults(true);
    // Optionally, trigger the algorithm here and update the state:
    // fetchAlgorithmResults(data).then(({ graph, network }) => {
    //   setGraphResponse(graph);
    //   setNetworkResponse(network);
    // });
  };

  return (
    <VehicleResultsProvider>
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
            {/* Display the vehicle search results */}
            <VehicleSearchResults results={results} />
            
            {/* Display the algorithm visualization results if they exist */}
            {graphResponse && networkResponse && (
              <ResultsDisplay
                graphResponse={graphResponse}
                networkResponse={networkResponse}
              />
            )}
          </div>
        </div>
      )}
    </VehicleResultsProvider>
  );
};

export default VehicleSearchContainer;
