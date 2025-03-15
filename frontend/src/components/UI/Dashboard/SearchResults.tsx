import React, { useState } from "react";
import { VehicleSearchResult } from "@/components/UI/Dashboard/ControlPanel/Options/SearchVehicles";

interface VehicleSearchResultsProps {
  results: VehicleSearchResult[];
  onClose?: () => void;
}

const VehicleSearchResults: React.FC<VehicleSearchResultsProps> = ({ results, onClose }) => {
  // Pagination state
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(results.length / pageSize);

  const displayedResults = results.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDownloadCSV = () => {
    const headers = [
      "Timestamp",
      "TPMS ID",
      "Sensor Model",
      "Car Model",
      "Location",
      "Latitude",
      "Longitude",
      "Signal Strength",
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

  const handleVisualizeOnMap = () => {
    console.log("Visualize on Map:", results);
    alert("Map visualization coming soon!");
  };

  return (
    <div className="w-full h-full p-4 bg-[#1a1a1a] rounded-md shadow-md relative">
      {/* Close Icon */}
      {onClose && (
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-white text-2xl font-bold"
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
                <td className="border p-2">
                  {new Date(result.timestamp).toLocaleString()}
                </td>
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

      {/* Pagination controls */}
      <div className="flex items-center justify-center mt-4">
        <button 
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="text-green-400 hover:underline disabled:text-gray-500 mr-4"
        >
          Previous
        </button>
        <span className="text-white">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button 
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="text-green-400 hover:underline disabled:text-gray-500 ml-4"
        >
          Next
        </button>
      </div>

      {/* Action Buttons */}
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
          Visualize on Map
        </button>
      </div>
    </div>
  );
};

export default VehicleSearchResults;
