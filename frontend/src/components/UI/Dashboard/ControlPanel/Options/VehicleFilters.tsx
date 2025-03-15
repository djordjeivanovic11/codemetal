// src/Options/VehicleFilters.tsx
import React, { useState } from "react";
import CollapsibleSection from "@/components/UI/Dashboard/ControlPanel/CollapsibleSection";

const VehicleFilters: React.FC = () => {
  // States for timeframe filtering
  const [fromDateTime, setFromDateTime] = useState("");
  const [toDateTime, setToDateTime] = useState("");

  // States for radius filtering
  const [address, setAddress] = useState("");
  const [radius, setRadius] = useState(5);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState("");
  const handleGeocode = async () => {
    try {
      if (!address.trim()) {
        setError("Please enter an address to search within radius.");
        return;
      }
      // Retrieve the API key from environment variables
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        setError("Google Maps API key is not configured.");
        return;
      }
      
      // Build the request URL
      const requestUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`;
      
      const response = await fetch(requestUrl, { method: "GET" });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === "OK" && data.results && data.results.length > 0) {
        // Use the first result's geometry
        const location = data.results[0].geometry.location;
        setLatLng({ lat: location.lat, lng: location.lng });
        setError("");
      } else {
        // Handle cases when no results are found or API returns an error status.
        setError("Address not found. Please try another address.");
        setLatLng(null);
      }
    } catch (err: unknown) {
      console.error("Geocoding error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to retrieve coordinates.");
      }
    }
  };
  

  const handleApplyFilters = () => {
    // Gather the filter values for time and radius.
    const filters = {
      fromDateTime,
      toDateTime,
      address,
      radius,
      latLng,
    };
    console.log("Applying filters:", filters);
    // Here, you would typically send these filters to your backend API,
    // update your UI, or trigger a map update.
  };

  return (
    <CollapsibleSection title="Vehicle Filters">
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          Fine-tune your search by filtering vehicles with precise time and geographic criteria.
        </p>
        
        {/* Timeframe Filter */}
        <div className="space-y-2">
          <label className="block text-gray-300 text-sm">From (Date & Time)</label>
          <input
            type="datetime-local"
            value={fromDateTime}
            onChange={(e) => setFromDateTime(e.target.value)}
            className="w-full bg-[#1a1a1a] text-white border border-gray-700 rounded-md p-2"
            title="From Date & Time"
          />
          <label className="block text-gray-300 text-sm">To (Date & Time)</label>
          <input
            type="datetime-local"
            value={toDateTime}
            onChange={(e) => setToDateTime(e.target.value)}
            className="w-full bg-[#1a1a1a] text-white border border-gray-700 rounded-md p-2"
            title="To Date & Time"
          />
        </div>
        
        {/* Radius Filter */}
        <div className="space-y-2">
          <label className="block text-gray-300 text-sm">Search Location (Address)</label>
          <input
            type="text"
            placeholder="Enter an address or street"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-[#1a1a1a] text-white border border-gray-700 rounded-md p-2"
          />
          <button
            onClick={handleGeocode}
            className="bg-[#c1ff72] text-black font-bold py-1 px-2 rounded-md hover:bg-[#d1ff7f]"
          >
            Find Coordinates
          </button>
          {latLng && (
            <p className="text-gray-300 text-sm">
              Coordinates: {latLng.lat.toFixed(4)}, {latLng.lng.toFixed(4)}
            </p>
          )}
          <label className="block text-gray-300 text-sm">Radius (km)</label>
          <input
            type="number"
            min="1"
            max="100"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full bg-[#1a1a1a] text-white border border-gray-700 rounded-md p-2"
            title="Radius in kilometers"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <button
          onClick={handleApplyFilters}
          className="w-full bg-[#c1ff72] text-black font-bold py-2 rounded-md hover:bg-[#d1ff7f]"
        >
          Apply Filters
        </button>
      </div>
    </CollapsibleSection>
  );
};

export default VehicleFilters;
