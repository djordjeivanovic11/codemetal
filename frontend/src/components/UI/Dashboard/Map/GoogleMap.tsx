import React, { useState, useEffect } from "react";
import { APIProvider, Map, MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import VehicleMarker from "@/components/UI/Dashboard/Map/Markers/VehicleMarker";
import LanternMarker from "@/components/UI/Dashboard/Map/Markers/LanternMarker";
import { lanternNodes as positions } from "@/data/positions";
import MapControls from "@/components/UI/Dashboard/Map/MapControls";
import { Detection } from "@/api/search/route";

// Extend MapCameraChangedEvent to include the map property.
interface ExtendedMapCameraChangedEvent extends MapCameraChangedEvent {
  detail: {
    center: google.maps.LatLngLiteral;
    bounds: google.maps.LatLngBoundsLiteral;
    zoom: number;
    heading: number;
    tilt: number;
    map?: google.maps.Map;
  };
}

const EnterpriseVehicleTrackingMap: React.FC = () => {
  // Fixed vehicle position.
  const fixedPosition = {
    lat: 42.3601,
    lng: -71.0589,
    timestamp: Date.now(),
  };

  // State for local search results.
  const [searchResults, setSearchResults] = useState<Detection[]>([]);

  // Consolidated state for map controls.
  const [controls, setControls] = useState({
    tilt: 0,
    heading: 0,
    zoom: 15,
    followVehicle: true,
  });

  // Store the map instance.
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  // Capture the map instance when the camera changes.
  const handleCameraChanged = (ev: ExtendedMapCameraChangedEvent) => {
    if (!mapInstance && ev.detail.map) {
      setMapInstance(ev.detail.map);
    }
  };

  // Auto-center the map when following the vehicle.
  useEffect(() => {
    if (controls.followVehicle && mapInstance) {
      mapInstance.panTo({ lat: fixedPosition.lat, lng: fixedPosition.lng });
    }
  }, [controls.followVehicle, mapInstance]);

  // Function to load search results from local storage.
  const loadSearchResults = () => {
    const data = localStorage.getItem("vehicleSearchResults");
    if (data) {
      try {
        const parsedResults = JSON.parse(data) as Detection[];
        setSearchResults(parsedResults);
      } catch (error) {
        console.error("Error parsing vehicle search results from localStorage:", error);
      }
    }
  };

  // Load search results on mount.
  useEffect(() => {
    loadSearchResults();
  }, []);

  // Poll local storage every minute for updated search results.
  useEffect(() => {
    const interval = setInterval(() => {
      loadSearchResults();
    }, 6000); // 60000ms = 1 minute

    return () => clearInterval(interval);
  }, []);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <Map
        defaultCenter={{ lat: fixedPosition.lat, lng: fixedPosition.lng }}
        defaultZoom={controls.zoom}
        tilt={controls.tilt}
        heading={controls.heading}
        onCameraChanged={handleCameraChanged}
        mapId={process.env.NEXT_PUBLIC_MAP_ID}
      >
        {/* Render the fixed vehicle marker */}
        <VehicleMarker position={fixedPosition} />
        {/* Render lantern nodes */}
        {positions.map((pos) => (
          <LanternMarker key={pos.id} nodeId={pos.id} position={{ lat: pos.lat, lng: pos.lng }} />
        ))}
        {/* Render vehicle markers if local storage has data */}
        {searchResults.length > 0 &&
          searchResults.map((det, index) => (
            <VehicleMarker
              key={`search-${index}`}
              position={{ lat: det.latitude, lng: det.longitude, timestamp: Date.now() }}
            />
          ))}
      </Map>

      <MapControls
        followVehicle={controls.followVehicle}
        tilt={controls.tilt}
        heading={controls.heading}
        zoom={controls.zoom}
        onFollowToggle={() =>
          setControls((prev) => ({ ...prev, followVehicle: !prev.followVehicle }))
        }
        onTiltChange={(tilt) => setControls((prev) => ({ ...prev, tilt }))}
        onHeadingChange={(heading) => setControls((prev) => ({ ...prev, heading }))}
        onZoomChange={(zoom) => setControls((prev) => ({ ...prev, zoom }))}
      />
    </APIProvider>
  );
};

export default EnterpriseVehicleTrackingMap;
