import React, { useState } from "react";
import CollapsibleSection from "@/components/UI/Dashboard/ControlPanel/CollapsibleSection";

const AlertsNotifications: React.FC = () => {
  const [alertName, setAlertName] = useState("");
  const [notificationEmail, setNotificationEmail] = useState("");

  const handleSaveSettings = () => {
    // This function can send the alert settings to your backend.
    // For now, we simply log the settings.
    console.log("Alert Name:", alertName);
    console.log("Notification Email:", notificationEmail);
    // TODO: call your API to save these settings.
  };

  return (
    <CollapsibleSection title="Alerts & Notifications">
      <div className="space-y-3">
        <p className="text-sm text-gray-400">
          Configure how you receive critical mission updates.
        </p>

        <label className="block text-gray-300 text-sm">
          Alert Name
        </label>
        <input
          type="text"
          placeholder="Enter a custom alert name (e.g., High Priority Alert)"
          value={alertName}
          onChange={(e) => setAlertName(e.target.value)}
          className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded-md text-white"
        />

        <label className="block text-gray-300 text-sm">
          Notification Email
        </label>
        <input
          type="email"
          placeholder="agent@organization.com"
          value={notificationEmail}
          onChange={(e) => setNotificationEmail(e.target.value)}
          className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded-md text-white"
        />

        <button
          onClick={handleSaveSettings}
          className="w-full bg-[#c1ff72] text-black font-bold py-2 rounded-md hover:bg-[#d1ff7f]"
        >
          Save Alert Settings
        </button>
      </div>
    </CollapsibleSection>
  );
};

export default AlertsNotifications;
