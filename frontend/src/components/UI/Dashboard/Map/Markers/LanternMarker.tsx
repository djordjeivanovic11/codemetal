import React, { useState } from "react";
import { AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { useHighlightedNodes } from "@/components/UI/Dashboard/Map/Markers/Context/HighlightedNodesContext";

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
  nodeId: string;
  health?: Health;
  readings?: Reading[];
}

const LanternMarker: React.FC<LanternMarkerProps> = ({ position, nodeId, health, readings }) => {
  const [showInfo, setShowInfo] = useState(false);
  const { highlightedNodes } = useHighlightedNodes();

  // Check if this node is highlighted.
  // Assumes highlightedNodes is an array of objects with an "id" property.
  const isHighlighted = highlightedNodes.some((node) => node.id === nodeId);

  // Fallback dummy data if no health or readings are provided.
  const dummyHealth: Health = {
    signal_strength: 100,
    status: "Operational",
  };

  const dummyReadings: Reading[] = [
    {
      timestamp: new Date().toISOString(),
      tpms_model: "Model X",
      tpms_id: "ID-123",
    },
    {
      timestamp: new Date().toISOString(),
      tpms_model: "Model X",
      tpms_id: "ID-123",
    },
    {
      timestamp: new Date().toISOString(),
      tpms_model: "Model X",
      tpms_id: "ID-123",
    },
  ];

  // Use provided values or fall back to the dummy data.
  const displayHealth = health || dummyHealth;
  const displayReadings = readings && readings.length > 0 ? readings : dummyReadings;

  return (
    <>
      {/* Marker */}
      <AdvancedMarker 
        position={position} 
        title="Lantern Node"
        onClick={() => setShowInfo(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 40 40">
          <polygon points="10,10 30,10 20,30" fill="#c1ff72" stroke="#ff0000" strokeWidth="4" />
        </svg>
      </AdvancedMarker>
      
      {/* Highlight Overlay */}
      {isHighlighted && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: position.lng,
            top: position.lat,
            width: "60px",
            height: "60px",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 15px 5px yellow",
            borderRadius: "50%",
          }}
        />
      )}
      
      {/* Info Window */}
      {showInfo && (
        <InfoWindow
          position={position}
          onCloseClick={() => setShowInfo(false)}
        >
          <div className="p-4 bg-[#1a1a1a] text-white rounded-md shadow-md" style={{ maxWidth: "250px" }}>
            <h4 className="font-bold text-lg mb-1">
              Node Health: {displayHealth.status}
            </h4>
            <p className="mb-2">
              Signal Strength: {displayHealth.signal_strength}
            </p>
            <h5 className="mt-2 mb-1 font-semibold">Last Three Readings:</h5>
            {displayReadings.slice(0, 3).length > 0 ? (
              <ul className="list-disc list-inside text-sm">
                {displayReadings.slice(0, 3).map((r, index) => (
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
