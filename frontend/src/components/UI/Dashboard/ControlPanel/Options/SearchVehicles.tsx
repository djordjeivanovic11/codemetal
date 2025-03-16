import React, { useState } from "react";
import CollapsibleSection from "@/components/UI/Dashboard/ControlPanel/CollapsibleSection";
import {
  searchByIds,
  searchByModel,
  searchByModelAndId,
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

    // License plate is logged only.
    if (licensePlate.trim() !== "") {
      console.log(`License Plate provided: ${licensePlate}`);
    }

    // Filter out empty tire ID inputs.
    const validTireIds = tireIds.filter((id) => id.trim() !== "");
    console.log(`Valid tire IDs: ${validTireIds.join(", ")}`);

    try {
      let searchResults: Detection[] = [];

      if (sensorModel && validTireIds.length > 0) {
        // Use searchByModelAndId for each tire ID.
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
        // Only sensor model provided.
        console.log(`Using searchByModel with sensor model "${sensorModel}"`);
        const response: DetectionsResponse = await searchByModel(sensorModel);
        console.log(`Found ${response.detections.length} detections for sensor model "${sensorModel}"`);
        searchResults = response.detections;
      } else if (validTireIds.length > 0) {
        // Only tire IDs provided.
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

        {/* Four separate tire ID fields */}
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
        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full bg-[#c1ff72] text-black font-bold py-2 rounded-md hover:bg-[#d1ff7f]"
        >
          {loading ? "Searching..." : "Search"}
        </button>

        {/* Display search results */}
        console.log(`Found ${results.length} result(s).`)
      </div>
    </CollapsibleSection>
  );
};

export default VehicleSearch;
