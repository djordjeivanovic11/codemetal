import React, { useEffect, useMemo, useRef } from "react";
import { GoogleMapsOverlay } from "@deck.gl/google-maps";
import { PathLayer } from "@deck.gl/layers";
import { VehiclePosition } from "@/hooks/useVehicleTracking";

interface VehiclePathOverlayProps {
  mapInstance: google.maps.Map;
  vehiclePath: VehiclePosition[];
}

const VehiclePathOverlay: React.FC<VehiclePathOverlayProps> = ({
  mapInstance,
  vehiclePath,
}) => {
  const overlayRef = useRef<GoogleMapsOverlay | null>(null);

  const pathData = useMemo(
    () => [
      {
        path: vehiclePath.map((pos) => [pos.lng, pos.lat]),
      },
    ],
    [vehiclePath]
  );

  const layer = useMemo(
    () =>
      new PathLayer({
        id: "vehicle-path",
        data: pathData,
        getPath: (d: { path: [number, number][] }) => d.path,
        getWidth: () => 2,
        getColor: () => [255, 0, 0, 200],
        widthMinPixels: 1,
      }),
    [pathData]
  );

  useEffect(() => {
    if (!mapInstance) return;

    if (!overlayRef.current) {
      overlayRef.current = new GoogleMapsOverlay({
        layers: [layer],
      });
      overlayRef.current.setMap(mapInstance);
    } else {
      overlayRef.current.setProps({ layers: [layer] });
    }
  }, [mapInstance, layer]);

  useEffect(() => {
    return () => {
      if (overlayRef.current) {
        overlayRef.current.setMap(null);
        overlayRef.current = null;
      }
    };
  }, []);

  return null;
};

export default VehiclePathOverlay;
