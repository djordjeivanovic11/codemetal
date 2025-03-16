// src/Components/ControlPanel.tsx
import React from "react";
import VehicleSearchContainer from "@/components/UI/Dashboard/VehicleSearchContainer";
import VehicleFilters from "@/components/UI/Dashboard/ControlPanel/Options/VehicleFilters";
import SensorNetwork from "@/components/UI/Dashboard/ControlPanel/Options/SensorNetwork";
import AlertsNotifications from "@/components/UI/Dashboard/ControlPanel/Options/AlertNotifications";
import DescriptionSearch from "@/components/UI/Dashboard/ControlPanel/Options/DescriptionSearch";
import DetectionsUpload from "@/components/UI/Dashboard/ControlPanel/Options/DetectionsUpload";
import GetLiveButton from "@/components/UI/Dashboard/ControlPanel/Options/GetLive";

const ControlPanel: React.FC = () => {
  return (
    <aside className="w-130 h-screen bg-[#28292b] p-6 shadow-xl border-r border-gray-800 overflow-y-auto flex flex-col">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold text-[#c1ff72] mb-6">Control Panel</h2>
        <VehicleSearchContainer />
        <VehicleFilters />
        <SensorNetwork />
        <AlertsNotifications />
        <DescriptionSearch />
        <DetectionsUpload />
      </div>
      <GetLiveButton />
      {/* Option to change application */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <button
          onClick={() => {
            localStorage.removeItem("selectedApplication");
            window.location.reload();
          }}
          className="w-full bg-green-600 text-white font-bold py-2 rounded-md hover:bg-green-500"
        >
          Change Application
        </button>
      </div>
    </aside>
  );
};

export default ControlPanel;
