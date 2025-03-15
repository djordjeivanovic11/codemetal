import React from "react";
import { Marker } from "@vis.gl/react-google-maps";

interface LanternMarkerProps {
  position: google.maps.LatLngLiteral;
}

const LanternMarker: React.FC<LanternMarkerProps> = ({ position }) => {
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

  return <Marker position={position} icon={svgIcon} title="Lantern Node" />;
};

export default LanternMarker;
