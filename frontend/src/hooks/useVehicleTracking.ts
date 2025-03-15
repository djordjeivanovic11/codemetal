import { useState, useEffect } from "react";

export interface VehiclePosition {
  lat: number;
  lng: number;
  timestamp: number;
}

export function useVehicleTracking(initialPosition: VehiclePosition) {
  const [position, setPosition] = useState<VehiclePosition>(initialPosition);
  const [path, setPath] = useState<VehiclePosition[]>([initialPosition]);

  // Maximum number of points to store in the path to prevent unbounded growth.
  const MAX_PATH_POINTS = 100;

  useEffect(() => {
    // In an enterprise app, replace this with an API/WebSocket subscription.
    const interval = setInterval(() => {
      setPosition((prev) => {
        // Adjust the delta multiplier if the movement is too subtle.
        const newPos: VehiclePosition = {
          lat: prev.lat + (Math.random() - 0.5) * 0.0005,
          lng: prev.lng + (Math.random() - 0.5) * 0.0005,
          timestamp: Date.now(),
        };

        setPath((prevPath) => {
          const newPath = [...prevPath, newPos];
          if (newPath.length > MAX_PATH_POINTS) {
            newPath.shift();
          }
          return newPath;
        });

        return newPos;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { position, path };
}
