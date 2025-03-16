import React from "react";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { VehiclePosition } from "@/hooks/useVehicleTracking";

interface VehicleMarkerProps {
  position: VehiclePosition;
}

const VehicleMarker: React.FC<VehicleMarkerProps> = ({ position }) => (
  <AdvancedMarker position={position}>
    <svg
      width="40"
      height="40"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Car Body */}
      <rect
        x="8"
        y="24"
        width="48"
        height="16"
        rx="4"
        fill="#FFD700"  // bright yellow
        stroke="#000"   // black outline
        strokeWidth="4"
      />
      {/* Wheels */}
      <circle cx="20" cy="48" r="6" fill="#000" />
      <circle cx="44" cy="48" r="6" fill="#000" />
    </svg>
  </AdvancedMarker>
);

export default VehicleMarker;
