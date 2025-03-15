import React, { useState, ChangeEvent } from "react";

interface MapControlsProps {
  followVehicle: boolean;
  tilt: number;
  heading: number;
  zoom: number;
  onFollowToggle: () => void;
  onTiltChange: (value: number) => void;
  onHeadingChange: (value: number) => void;
  onZoomChange: (value: number) => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  followVehicle,
  tilt,
  heading,
  zoom,
  onFollowToggle,
  onTiltChange,
  onHeadingChange,
  onZoomChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const handleToggleCollapse = () => setIsCollapsed((prev) => !prev);
  const handleTilt = (e: ChangeEvent<HTMLInputElement>) =>
    onTiltChange(Number(e.target.value));
  const handleHeading = (e: ChangeEvent<HTMLInputElement>) =>
    onHeadingChange(Number(e.target.value));
  const handleZoom = (e: ChangeEvent<HTMLInputElement>) =>
    onZoomChange(Number(e.target.value));

  return (
    <div className="absolute top-10 right-10 p-6 bg-[#1a1a1a] rounded-xl shadow-2xl z-50 min-w-[260px] text-white font-sans">
      <div
        className="flex justify-between items-center cursor-pointer border-b border-gray-700 pb-2"
        onClick={handleToggleCollapse}
      >
        <h4 className="m-0 text-xl font-bold tracking-wide">Map Controls</h4>
        <button
          className="bg-transparent border-none text-2xl font-bold focus:outline-none"
          aria-label={isCollapsed ? "Expand Controls" : "Collapse Controls"}
        >
          {isCollapsed ? "+" : "−"}
        </button>
      </div>
      {!isCollapsed && (
        <div className="mt-4 space-y-5">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={followVehicle}
              onChange={onFollowToggle}
              aria-label="Follow Vehicle"
              className="mr-2 h-4 w-4 text-[#c1ff72] focus:ring-[#c1ff72] border-gray-600 rounded"
            />
            <span className="text-sm">Follow Vehicle</span>
          </div>
          <div className="flex flex-col text-sm">
            <label className="mb-1">Tilt: {tilt}°</label>
            <input
              type="range"
              min={0}
              max={67}
              step={1}
              value={tilt}
              onChange={handleTilt}
              aria-label="Tilt"
              className="w-full accent-[#c1ff72] transition-all"
            />
          </div>
          <div className="flex flex-col text-sm">
            <label className="mb-1">Heading: {heading}°</label>
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={heading}
              onChange={handleHeading}
              aria-label="Heading"
              className="w-full accent-[#c1ff72] transition-all"
            />
          </div>
          <div className="flex flex-col text-sm">
            <label className="mb-1">Zoom: {zoom}</label>
            <input
              type="range"
              min={10}
              max={22}
              step={1}
              value={zoom}
              onChange={handleZoom}
              aria-label="Zoom"
              className="w-full accent-[#c1ff72] transition-all"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MapControls;
