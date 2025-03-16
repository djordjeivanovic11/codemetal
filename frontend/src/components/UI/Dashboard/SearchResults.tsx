import React, { useState } from "react";
import { VehicleSearchResult } from "@/components/UI/Dashboard/ControlPanel/Options/SearchVehicles";
import ResultsDisplay from "@/components/UI/Dashboard/ResultsDisplay";
import { createGraph, createNetwork, GraphResponse, NetworkResponse } from "@/api/visualize/route";

interface VehicleSearchResultsProps {
  results?: VehicleSearchResult[];
  onClose?: () => void;
}

const VehicleSearchResults: React.FC<VehicleSearchResultsProps> = ({ results = [], onClose }) => {
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(results.length / pageSize);
  const displayedResults = results.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // State to hold the algorithm results from the API calls.
  const [algorithmResults, setAlgorithmResults] = useState<{
    graphResponse: GraphResponse;
    networkResponse: NetworkResponse;
  } | null>(null);

  const handleDownloadCSV = () => {
    // Use lowercase header names to match backend expectations.
    const headers = [
      "timestamp",
      "tpms_id",
      "tpms_model",
      "car_model",
      "location",
      "latitude",
      "longitude",
      "signal_strength",
    ];
    const csvRows = [
      headers.join(","),
      ...results.map(result =>
        [
          result.timestamp,
          result.tpms_id,
          result.tpms_model,
          result.car_model,
          result.location,
          result.latitude,
          result.longitude,
          result.signal_strength,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvRows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vehicle_search_results.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleVisualizeOnMap = async () => {
    if (results.length === 0) {
      console.error("No search results available to generate CSV.");
      return;
    }

    // Create CSV data with headers expected by the backend.
    const headers = [
      "timestamp",
      "tpms_id",
      "tpms_model",
      "car_model",
      "location",
      "latitude",
      "longitude",
      "signal_strength",
    ];
    const csvRows = [
      headers.join(","),
      ...results.map(result =>
        [
          result.timestamp,
          result.tpms_id,
          result.tpms_model,
          result.car_model,
          result.location,
          result.latitude,
          result.longitude,
          result.signal_strength,
        ].join(",")
      ),
    ].join("\n");

    console.log("CSV Data:", csvRows);

    // Create a File object from the CSV data.
    const blob = new Blob([csvRows], { type: "text/csv" });
    const file = new File([blob], "vehicle_search_results.csv", { type: "text/csv" });

    // Derive search parameters from results.
    const searchByIds = results.map(r => r.tpms_id);
    const searchByModel = results[0]?.tpms_model; // use sensor model from the first result
    const buildNodePath = results[0]?.tpms_id; // use the first result's tpms_id for building node path

    try {
      // Call API endpoints to get graph and network data.
      const graphResponse = await createGraph(file);
      const networkResponse = await createNetwork(file, searchByIds, searchByModel, buildNodePath);

      console.log("Graph Response:", graphResponse);
      console.log("Network Response:", networkResponse);

      // Save the responses in state to display them immediately.
      setAlgorithmResults({ graphResponse, networkResponse });
    } catch (error) {
      console.error("Error generating visualization:", error);
    }
  };

  return (
    <div className="w-full h-full p-4 bg-[#1a1a1a] rounded-md shadow-md relative">
      {onClose && (
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-white text-2xl font-bold hover:underline"
          title="Close Results"
        >
          &times;
        </button>
      )}
      <h3 className="text-2xl font-bold text-white mb-4">Search Results</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-white border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Timestamp</th>
              <th className="border p-2">TPMS ID</th>
              <th className="border p-2">Sensor Model</th>
              <th className="border p-2">Car Model</th>
              <th className="border p-2">Location</th>
              <th className="border p-2">Signal Strength</th>
            </tr>
          </thead>
          <tbody>
            {displayedResults.map((result, index) => (
              <tr key={index}>
                <td className="border p-2">{new Date(result.timestamp).toLocaleString()}</td>
                <td className="border p-2">{result.tpms_id}</td>
                <td className="border p-2">{result.tpms_model}</td>
                <td className="border p-2">{result.car_model}</td>
                <td className="border p-2">{result.location}</td>
                <td className="border p-2">{result.signal_strength}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center mt-4">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="text-green-400 hover:underline disabled:text-gray-500 mr-4"
        >
          Previous
        </button>
        <span className="text-white">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="text-green-400 hover:underline disabled:text-gray-500 ml-4"
        >
          Next
        </button>
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={handleDownloadCSV}
          className="bg-[#c1ff72] text-black font-bold py-2 px-4 rounded-md hover:bg-[#d1ff7f]"
        >
          Get CSV
        </button>
        <button
          onClick={handleVisualizeOnMap}
          className="bg-[#c1ff72] text-black font-bold py-2 px-4 rounded-md hover:bg-[#d1ff7f]"
        >
          Run Algorithm
        </button>
      </div>

      {/* Display algorithm results immediately below */}
      {algorithmResults && (
        <div className="mt-6">
          <ResultsDisplay 
            graphResponse={algorithmResults.graphResponse} 
            networkResponse={algorithmResults.networkResponse} 
          />
        </div>
      )}
    </div>
  );
};

export default VehicleSearchResults;
