import React from "react";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { VehiclePosition } from "@/hooks/useVehicleTracking";

interface VehicleMarkerProps {
  position: VehiclePosition;
}

const VehicleMarker: React.FC<VehicleMarkerProps> = ({ position }) => (
  <AdvancedMarker position={position}>
    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-300 rounded-full shadow-lg flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform duration-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-7 h-7 text-white"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.28 5.42 5.08 6.01L3 11v9c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h14v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-9l-2.08-4.99zM6.5 7h11l1.16 2.99H5.34L6.5 7zM19 15c-.83 0-1.5.67-1.5 1.5S18.17 18 19 18s1.5-.67 1.5-1.5S19.83 15 19 15zm-14 0c-.83 0-1.5.67-1.5 1.5S4.17 18 5 18s1.5-.67 1.5-1.5S5.83 15 5 15z" />
      </svg>
    </div>
  </AdvancedMarker>
);

export default VehicleMarker;
