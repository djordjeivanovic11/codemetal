import React, { useState } from "react";
import CollapsibleSection from "@/components/UI/Dashboard/ControlPanel/CollapsibleSection";
import {
  searchByIds,
  searchByModel,
  searchByModelAndId,
  searchIdsSummary,
  Detection,
  DetectionsResponse,
} from "@/api/search/route";

export interface VehicleSearchResult extends Detection {
  signal_strength: number;
  video_url?: string;
}

interface VehicleSearchProps {
  onSearchResults?: (results: VehicleSearchResult[]) => void;
}

const VehicleSearch: React.FC<VehicleSearchProps> = ({ onSearchResults }) => {
  const [licensePlate, setLicensePlate] = useState("");
  // Four tire ID fields; first is required, others optional.
  const [tireIds, setTireIds] = useState<string[]>(["", "", "", ""]);
  const [sensorModel, setSensorModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // The standard search button might update local state to display results.
  const [results, setResults] = useState<VehicleSearchResult[]>([]);

  // Update a specific tire ID field.
  const handleTireIdChange = (index: number, value: string) => {
    const newTireIds = [...tireIds];
    newTireIds[index] = value;
    setTireIds(newTireIds);
  };

  const handleSearch = async () => {
    setError("");
    setResults([]);
    setLoading(true);

    if (licensePlate.trim() !== "") {
      console.log(`License Plate provided: ${licensePlate}`);
    }

    const validTireIds = tireIds.filter((id) => id.trim() !== "");
    console.log(`Valid tire IDs: ${validTireIds.join(", ")}`);

    try {
      let searchResults: Detection[] = [];

      if (sensorModel && validTireIds.length > 0) {
        console.log(results);
        console.log(
          `Using searchByModelAndId with sensor model "${sensorModel}" and tire IDs: ${validTireIds.join(
            ", "
          )}`
        );
        for (const id of validTireIds) {
          console.log(`Searching for sensor model "${sensorModel}" and tire ID "${id}"`);
          const response: DetectionsResponse = await searchByModelAndId(sensorModel, id);
          console.log(`Found ${response.detections.length} detections for tire ID "${id}"`);
          searchResults = [...searchResults, ...response.detections];
        }
      } else if (sensorModel) {
        console.log(`Using searchByModel with sensor model "${sensorModel}"`);
        const response: DetectionsResponse = await searchByModel(sensorModel);
        console.log(`Found ${response.detections.length} detections for sensor model "${sensorModel}"`);
        searchResults = response.detections;
      } else if (validTireIds.length > 0) {
        console.log(`Using searchByIds with tire IDs: ${validTireIds.join(", ")}`);
        const response: DetectionsResponse = await searchByIds(validTireIds);
        console.log(`Found ${response.detections.length} detections for tire IDs`);
        searchResults = response.detections;
      } else {
        console.log("No valid search criteria provided.");
        setError("Please provide at least a sensor model or a tire ID to search.");
        return;
      }

      setResults(searchResults as VehicleSearchResult[]);
      if (onSearchResults) {
        onSearchResults(searchResults as VehicleSearchResult[]);
      }
      console.log(`Search completed with ${searchResults.length} result(s).`);
    } catch (err: unknown) {
      console.log(`Error during search: ${err}`);
      setError("An error occurred during the search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // The "Search and Visualize" button now uses the summary search, stores the results in localStorage,
  // and then reloads the page nicely.
  const handleSearchAndVisualize = async () => {
    setError("");
    setLoading(true);
    localStorage.removeItem("vehicleSearchResults"); // Clear previous results

    const validTireIds = tireIds.filter((id) => id.trim() !== "");
    if (validTireIds.length === 0) {
      setError("Please provide at least one tire ID for search and visualize.");
      setLoading(false);
      return;
    }
    try {
      console.log(`Using searchIdsSummary with tire IDs: ${validTireIds.join(", ")}`);
      const response: DetectionsResponse = await searchIdsSummary(validTireIds);
      console.log(`Found ${response.detections.length} summary detections for tire IDs`);
      
      // Save the results in localStorage for later use.
      localStorage.setItem(
        "vehicleSearchResults",
        JSON.stringify(response.detections)
      );
      
      // Optionally, call onSearchResults if needed:
      // if (onSearchResults) {
      //   onSearchResults(response.detections as VehicleSearchResult[]);
      // }
      
      // Reload the page nicely.
      window.location.reload();
    } catch (err: unknown) {
      console.error("Error during search and visualize:", err);
      setError("An error occurred during the search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CollapsibleSection title="Search Vehicle">
      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm mb-1">License Plate</label>
          <input
            type="text"
            placeholder="Enter license plate (e.g., ABC-123)"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded-md text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-300 text-sm mb-1">Tire IDs</label>
          <div className="flex flex-col space-y-2">
            {tireIds.map((tireId, index) => (
              <div key={index}>
                <input
                  type="text"
                  placeholder={
                    index === 0 ? "Tire ID 1 (required)" : `Tire ID ${index + 1} (optional)`
                  }
                  value={tireId}
                  onChange={(e) => handleTireIdChange(index, e.target.value)}
                  className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded-md text-white"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">Sensor Model</label>
          <input
            type="text"
            placeholder="Enter sensor model (e.g., ModelX)"
            value={sensorModel}
            onChange={(e) => setSensorModel(e.target.value)}
            className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded-md text-white"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        {/* Standard Search Button */}
        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full bg-[#c1ff72] text-black font-bold py-2 rounded-md hover:bg-[#d1ff7f]"
        >
          {loading ? "Searching..." : "Search"}
        </button>

        {/* Search and Visualize Button */}
        <button
          onClick={handleSearchAndVisualize}
          disabled={loading}
          className="w-full bg-[#c1ff72] text-black font-bold py-2 rounded-md hover:bg-[#d1ff7f]"
        >
          Search and Visualize
        </button>
      </div>
    </CollapsibleSection>
  );
};

export default VehicleSearch;
