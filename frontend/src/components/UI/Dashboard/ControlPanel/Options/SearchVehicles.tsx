// src/Options/VehicleSearch.tsx
import React, { useState } from "react";
import CollapsibleSection from "@/components/UI/Dashboard/ControlPanel/CollapsibleSection";

export interface VehicleSearchResult {
  timestamp: string;
  tpms_id: string;
  tpms_model: string;
  car_model: string;
  location: string;
  latitude: number;
  longitude: number;
  signal_strength: number;
  video_url?: string;
}

interface VehicleSearchProps {
  onSearchResults?: (results: VehicleSearchResult[]) => void;
}

const VehicleSearch: React.FC<VehicleSearchProps> = ({ onSearchResults }) => {
  const [licensePlate, setLicensePlate] = useState("");
  // Create state for four tire IDs; first is required, others are optional.
  const [tireIds, setTireIds] = useState<string[]>(["", "", "", ""]);
  const [sensorModel, setSensorModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Update a specific tire field.
  const handleTireIdChange = (index: number, value: string) => {
    const newTireIds = [...tireIds];
    newTireIds[index] = value;
    setTireIds(newTireIds);
  };

  const handleSearch = async () => {
    setLoading(true);
    setError("");

    // Validate that the first tire ID is provided.
    if (!tireIds[0].trim()) {
      setError("Tire ID 1 is required.");
      setLoading(false);
      return;
    }

    // For dummy data, we simulate a delay and then return a dummy list.
    setTimeout(() => {
      const dummyResults: VehicleSearchResult[] = [
        {
          timestamp: new Date().toISOString(),
          tpms_id: "TPMS_001",
          tpms_model: "ModelX",
          car_model: "Sedan",
          location: "Downtown",
          latitude: 42.387414,
          longitude: -71.099972,
          signal_strength: 90,
          video_url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        },
        {
          timestamp: new Date().toISOString(),
          tpms_id: "TPMS_002",
          tpms_model: "ModelY",
          car_model: "SUV",
          location: "Midtown",
          latitude: 42.388000,
          longitude: -71.100000,
          signal_strength: 85,
          video_url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        },
      ];
      if (onSearchResults) {
        onSearchResults(dummyResults);
      }
      console.log("Search Results:", dummyResults);
      setLoading(false);
    }, 1000);
  };

  return (
    <CollapsibleSection title="Search Vehicle">
      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm mb-1">
            License Plate
          </label>
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
            <div>
              <input
                type="text"
                placeholder="Tire ID 1 (required)"
                value={tireIds[0]}
                onChange={(e) => handleTireIdChange(0, e.target.value)}
                className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded-md text-white"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Tire ID 2 (optional)"
                value={tireIds[1]}
                onChange={(e) => handleTireIdChange(1, e.target.value)}
                className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded-md text-white"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Tire ID 3 (optional)"
                value={tireIds[2]}
                onChange={(e) => handleTireIdChange(2, e.target.value)}
                className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded-md text-white"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Tire ID 4 (optional)"
                value={tireIds[3]}
                onChange={(e) => handleTireIdChange(3, e.target.value)}
                className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded-md text-white"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">
            Sensor Model
          </label>
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
      </div>
    </CollapsibleSection>
  );
};

export default VehicleSearch;
