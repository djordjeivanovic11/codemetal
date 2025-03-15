import React from "react";
import CollapsibleSection from "./CollapsibleSection";

const ControlPanel: React.FC = () => {
  return (
    <aside className="w-96 h-screen bg-[#0e0e0e] p-6 shadow-xl border-r border-gray-800 overflow-y-auto">
      <h2 className="text-2xl font-bold text-[#c1ff72] mb-6">Control Panel</h2>

      {/* 1) SEARCH VEHICLES */}
      <CollapsibleSection title="Search Vehicles">
        <div className="space-y-2">
          <p className="text-sm text-gray-400">
            Quickly locate a car by unique attributes.
          </p>
          <label className="block text-gray-300 text-sm">Search By</label>
          <select
            aria-label="Search By"
            className="w-full bg-[#1a1a1a] text-white border border-gray-700 rounded-md p-2"
          >
            <option>License Plate</option>
            <option>Car Type</option>
            <option>Owner Name</option>
            <option>Signal ID</option>
          </select>
          <input
            type="text"
            placeholder="Enter query (e.g., ABC-123)"
            className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded-md text-white"
          />
          <button className="w-full bg-[#c1ff72] text-black font-bold py-2 rounded-md hover:bg-[#d1ff7f]">
            Search
          </button>
        </div>
      </CollapsibleSection>

      {/* 2) VEHICLE FILTERS */}
      <CollapsibleSection title="Vehicle Filters">
        <div className="space-y-3">
          <p className="text-sm text-gray-400">
            Fine-tune your search by filtering vehicles.
          </p>
          <label className="block text-gray-300 text-sm">Color</label>
          <select
            aria-label="Vehicle Colors"
            multiple
            className="w-full bg-[#1a1a1a] text-white border border-gray-700 rounded-md p-2 h-24"
          >
            <option>Black</option>
            <option>White</option>
            <option>Gray</option>
            <option>Red</option>
            <option>Blue</option>
          </select>
          <small className="text-gray-500">
            (Hold CTRL or CMD to select multiple)
          </small>
          <label className="block text-gray-300 text-sm">Last Seen</label>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              className="bg-[#1a1a1a] text-white border border-gray-700 rounded-md p-1"
              title="Select a date"
            />
            <span className="text-gray-300">to</span>
            <input
              type="date"
              className="bg-[#1a1a1a] text-white border border-gray-700 rounded-md p-1"
              title="Select a date"
            />
          </div>
          <button className="w-full bg-[#c1ff72] text-black font-bold py-2 rounded-md hover:bg-[#d1ff7f]">
            Apply Filters
          </button>
        </div>
      </CollapsibleSection>

      {/* 3) SENSOR NETWORK */}
      <CollapsibleSection title="Sensor Network">
        <div className="space-y-3">
          <p className="text-sm text-gray-400">
            Manage how the mesh network captures tire signals.
          </p>
          <label className="block text-gray-300 text-sm">
            Coverage Radius (km)
          </label>
          <input
            type="range"
            min="1"
            max="100"
            className="w-full"
            title="Coverage Radius"
          />
          <div className="flex items-center space-x-3 mt-3">
            <label className="text-gray-300 text-sm">
              Activate Sensors
            </label>
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-[#c1ff72] bg-[#1a1a1a] border-gray-700 rounded-sm"
              title="Activate Sensors"
            />
          </div>
          <button className="w-full bg-[#c1ff72] text-black font-bold py-2 rounded-md hover:bg-[#d1ff7f] mt-4">
            Update Network
          </button>
        </div>
      </CollapsibleSection>

      {/* 4) ALERTS & NOTIFICATIONS */}
      <CollapsibleSection title="Alerts & Notifications">
        <div className="space-y-3">
          <p className="text-sm text-gray-400">
            Configure how you receive critical mission updates.
          </p>
          <label className="block text-gray-300 text-sm">Alert Level</label>
          <select
            title="Alert Level"
            className="w-full bg-[#1a1a1a] text-white border border-gray-700 rounded-md p-2"
          >
            <option>All Alerts</option>
            <option>Critical Only</option>
            <option>None</option>
          </select>
          <div className="flex items-center space-x-3">
            <label className="text-gray-300 text-sm">
              Desktop Notifications
            </label>
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-[#c1ff72] bg-[#1a1a1a] border-gray-700 rounded-sm"
              title="Desktop Notifications"
            />
          </div>
          <label className="block text-gray-300 text-sm">
            Notification Email
          </label>
          <input
            type="email"
            className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded-md text-white"
            placeholder="agent@organization.com"
          />
        </div>
      </CollapsibleSection>

      {/* 5) ANALYTICS */}
      <CollapsibleSection title="Analytics">
        <div className="space-y-3">
          <p className="text-sm text-gray-400">
            Explore data on car detection, sensor reliability, and usage statistics.
          </p>
          <ul className="text-gray-300 text-sm list-disc list-inside">
            <li>Real-Time Tire Signal Strength</li>
            <li>Last 24h Car Detection Count</li>
            <li>Sensor Battery Levels</li>
          </ul>
        </div>
      </CollapsibleSection>

      {/* 6) SYSTEM SETTINGS */}
      <CollapsibleSection title="System Settings">
        <div className="space-y-3">
          <p className="text-sm text-gray-400">
            Configure advanced system parameters or check logs.
          </p>
          <button className="w-full bg-[#1a1a1a] text-gray-300 border border-gray-700 rounded-md py-2 hover:bg-[#2c2c2c]">
            View System Logs
          </button>
          <button className="w-full bg-red-600 text-white font-bold py-2 rounded-md hover:bg-red-500">
            Restart System
          </button>
        </div>
      </CollapsibleSection>
    </aside>
  );
};

export default ControlPanel;
