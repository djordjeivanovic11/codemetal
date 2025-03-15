import React, { useState } from "react";
import { Marker, InfoWindow } from "@vis.gl/react-google-maps";

export interface Reading { 
  timestamp: string; 
  tpms_model: string;
  tpms_id: string;
}

export interface Health {
  signal_strength: number;
  status: string; 
}

interface LanternMarkerProps {
  position: google.maps.LatLngLiteral;
  health?: Health;
  readings?: Reading[];
}

const LanternMarker: React.FC<LanternMarkerProps> = ({ position, health, readings }) => {
  const [showInfo, setShowInfo] = useState(false);

  // Updated SVG with a border (stroke) and thicker stroke width
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 40 40">
    <polygon points="10,10 30,10 20,30" fill="#c1ff72" stroke="#ff0000" stroke-width="4"/>
  </svg>`;
  
  const encodedSvg = encodeURIComponent(svgString)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");

  const svgIcon = {
    url: `data:image/svg+xml;charset=UTF-8,${encodedSvg}`,
    scaledSize: new google.maps.Size(50, 50),
  };

  return (
    <>
      <Marker
        position={position}
        icon={svgIcon}
        title="Lantern Node"
        onClick={() => setShowInfo(true)}
      />
      {showInfo && (
        <InfoWindow
          position={position}
          onCloseClick={() => setShowInfo(false)}
        >
          <div className="p-4 bg-[#1a1a1a] text-white rounded-md shadow-md" style={{ maxWidth: "250px" }}>
            <h4 className="font-bold text-lg mb-1">
              Node Health: {health ? health.status : "Unknown"}
            </h4>
            <p className="mb-2">Signal Strength: {health ? health.signal_strength : "N/A"}</p>
            <h5 className="mt-2 mb-1 font-semibold">Last Three Readings:</h5>
            {readings && readings.length > 0 ? (
              <ul className="list-disc list-inside text-sm">
                {readings.slice(0, 3).map((r, index) => (
                  <li key={index}>
                    {new Date(r.timestamp).toLocaleString()} – {r.tpms_model} – {r.tpms_id}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm">No readings available</p>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export default LanternMarker;
