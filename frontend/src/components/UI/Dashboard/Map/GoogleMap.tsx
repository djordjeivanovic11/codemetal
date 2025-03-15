import React, { useState, useEffect } from "react";
import { APIProvider, Map, MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import VehicleMarker from "@/components/UI/Dashboard/Map/Markers/VehicleMarker";
import LanternMarker from "@/components/UI/Dashboard/Map/Markers/LanternMarker";
import { lanternNodes as positions } from "@/data/positions";
import MapControls from "@/components/UI/Dashboard/Map/MapControls";
import { useVehicleTracking, VehiclePosition } from "@/hooks/useVehicleTracking";

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
  const initialPos: VehiclePosition = {
    lat: 42.3601,
    lng: -71.0589,
    timestamp: Date.now(),
  };

  const { position } = useVehicleTracking(initialPos);

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
      mapInstance.panTo({ lat: position.lat, lng: position.lng });
    }
  }, [position, controls.followVehicle, mapInstance]);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <Map
        defaultCenter={{ lat: initialPos.lat, lng: initialPos.lng }}
        defaultZoom={controls.zoom}
        tilt={controls.tilt}
        heading={controls.heading}
        onCameraChanged={handleCameraChanged}
        mapId={process.env.NEXT_PUBLIC_MAP_ID}
      >
        <VehicleMarker position={position} />
        {positions.map((pos) => (
          <LanternMarker key={pos.id} position={{ lat: pos.lat, lng: pos.lng }} />
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
