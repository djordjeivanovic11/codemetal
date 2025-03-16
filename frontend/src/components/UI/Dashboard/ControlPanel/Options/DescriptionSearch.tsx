import React, { useState } from "react";
import CollapsibleSection from "@/components/UI/Dashboard/ControlPanel/CollapsibleSection";

export interface VehicleSearchResult {
  source_id: string;
  location_name: string;
  latitude: number;
  longitude: number;
}

interface VehicleDescriptionSearchProps {
  onSearchResults?: (results: VehicleSearchResult[]) => void;
}

const VehicleDescriptionSearch: React.FC<VehicleDescriptionSearchProps> = ({ onSearchResults }) => {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");

    // Validate description: ensure it's not empty and contains at most 200 words.
    const words = description.trim().split(/\s+/);
    if (!description.trim()) {
      setError("Please enter a description.");
      setLoading(false);
      return;
    }
    if (words.length > 200) {
      setError("Description cannot exceed 200 words.");
      setLoading(false);
      return;
    }

    try {
      // Prepare query parameters from the description.
      const queryParams = new URLSearchParams();
      queryParams.append("description", description.trim());

      // Call the backend API endpoint (adjust the URL as needed)
      const response = await fetch(`/api/searchVehicleDescription?${queryParams.toString()}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Search failed, please try again.");
      }
      const results: VehicleSearchResult[] = await response.json();

      if (onSearchResults) {
        onSearchResults(results);
      }
      console.log("Search Results:", results);
    } catch (err: unknown) {
      console.error("Error searching vehicle:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <CollapsibleSection title="Search Vehicle by Description">
      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm mb-1">
            Car Description (max 200 words)
          </label>
          <textarea
            placeholder="Enter up to 200 words describing the car (e.g., color, model, condition, etc.)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded-md text-white"
            rows={6}
            maxLength={1500} // ~200 words depending on word length; adjust if needed.
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

export default VehicleDescriptionSearch;
