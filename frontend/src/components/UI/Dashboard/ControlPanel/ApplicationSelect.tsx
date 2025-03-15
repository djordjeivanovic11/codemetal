import React, { useEffect, useState } from "react";
import ControlPanel from "./ControlPanel";

const APPLICATION_KEY = "selectedApplication";

const ApplicationSelector: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  useEffect(() => {
    const savedApp = localStorage.getItem(APPLICATION_KEY);
    if (savedApp) {
      setSelectedApp(savedApp);
    }
  }, []);

  const handleSelect = (app: string) => {
    localStorage.setItem(APPLICATION_KEY, app);
    setSelectedApp(app);
  };

  if (selectedApp) {
    return <ControlPanel />;
  }

  return (
    <div className="w-full h-screen bg-[#28292b] flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-white mb-4">Select an Application</h1>
      <p className="text-gray-300 mb-8">
        Choose an application to get started with your IoT experience.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleSelect("TPMS")}
          className="bg-[#c1ff72] text-black font-bold py-2 px-4 rounded-md hover:bg-[#d1ff7f]"
        >
          TPMS (Car Tracking)
        </button>
        <button
          onClick={() => handleSelect("Bluetooth")}
          className="bg-[#c1ff72] text-black font-bold py-2 px-4 rounded-md hover:bg-[#d1ff7f]"
        >
          Bluetooth Beaconing (Coming Soon)
        </button>
        <button
          onClick={() => handleSelect("SmartParking")}
          className="bg-gray-600 text-white font-bold py-2 px-4 rounded-md opacity-75 cursor-not-allowed"
          disabled
        >
          Smart Parking (Coming Soon)
        </button>
        <button
          onClick={() => handleSelect("AssetTracking")}
          className="bg-gray-600 text-white font-bold py-2 px-4 rounded-md opacity-75 cursor-not-allowed"
          disabled
        >
          Asset Tracking (Coming Soon)
        </button>
        <button
          onClick={() => handleSelect("TrafficMonitoring")}
          className="bg-gray-600 text-white font-bold py-2 px-4 rounded-md opacity-75 cursor-not-allowed"
          disabled
        >
          Traffic Monitoring (Coming Soon)
        </button>
        <button
          onClick={() => handleSelect("EnvSensing")}
          className="bg-gray-600 text-white font-bold py-2 px-4 rounded-md opacity-75 cursor-not-allowed"
          disabled
        >
          Environmental Sensing (Coming Soon)
        </button>
      </div>
    </div>
  );
};

export default ApplicationSelector;