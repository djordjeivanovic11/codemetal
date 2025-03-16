// src/Options/SensorNetwork.tsx
import React, { useState, useEffect, ChangeEvent } from "react";
import CollapsibleSection from "@/components/UI/Dashboard/ControlPanel/CollapsibleSection";

interface Node {
  id: number;
  source_id: string;
  location_name: string;
  latitude: number;
  longitude: number;
}

const SensorNetwork: React.FC = () => {
  // Network settings state
  const [coverageRadius, setCoverageRadius] = useState<number>(50);
  const [sensorsActive, setSensorsActive] = useState<boolean>(false);

  // CSV Upload state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  // New node form state
  const [newNode, setNewNode] = useState({
    source_id: "",
    location_name: "",
    latitude: "",
    longitude: "",
  });
  const [addNodeStatus, setAddNodeStatus] = useState<string>("");

  // Node list management state
  const [nodes, setNodes] = useState<Node[]>([]);
  const [fetchStatus, setFetchStatus] = useState<string>("");
  const [healthStatus, setHealthStatus] = useState<{ [key: number]: string }>({});

  // Fetch all nodes from backend
  const fetchNodes = async () => {
    setFetchStatus("Fetching nodes...");
    try {
      const response = await fetch("/api/network/nodes");
      const data = await response.json();
      // Assume data.nodes is the array of nodes
      setNodes(data.nodes || []);
      setFetchStatus("");
    } catch (err) {
      console.error("Error fetching nodes:", err);
      setFetchStatus("Failed to fetch nodes.");
    }
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  // Handle CSV file selection
  const handleCsvChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  // Upload CSV file to backend
  const handleUploadCsv = async () => {
    if (!csvFile) {
      setUploadStatus("Please select a CSV file.");
      return;
    }
    setUploadStatus("Uploading...");
    try {
      const formData = new FormData();
      formData.append("file", csvFile);
      const response = await fetch("/api/network/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setUploadStatus(data.message || "Upload successful.");
      fetchNodes();
    } catch (err) {
      console.error("CSV upload error:", err);
      setUploadStatus("CSV upload failed.");
    }
  };

  // Handle new node input changes
  const handleNewNodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewNode((prev) => ({ ...prev, [name]: value }));
  };

  // Add new node via backend API
  const handleAddNode = async () => {
    setAddNodeStatus("Adding node...");
    try {
      const response = await fetch("/api/network/node", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNode),
      });
      const data = await response.json();
      setAddNodeStatus(data.message || "Node added successfully.");
      fetchNodes();
    } catch (err) {
      console.error("Error adding node:", err);
      setAddNodeStatus("Failed to add node.");
    }
  };

  // Delete node via backend API
  const handleDeleteNode = async (nodeId: number) => {
    try {
      const response = await fetch(`/api/network/node/${nodeId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      console.log(data.message);
      fetchNodes();
    } catch (err) {
      console.error("Error deleting node:", err);
    }
  };

  // Get health status for a node via backend API
  const handleGetNodeHealth = async (nodeId: number) => {
    try {
      const response = await fetch(`/api/network/health/${nodeId}`);
      const data = await response.json();
      setHealthStatus((prev) => ({ ...prev, [nodeId]: data.message }));
    } catch (err) {
      console.error("Error fetching node health:", err);
      setHealthStatus((prev) => ({ ...prev, [nodeId]: "Error" }));
    }
  };

  // Update network settings (e.g., coverage radius and sensor activation)
  const handleUpdateNetwork = async () => {
    try {
      // Example: send settings to backend or update local UI.
      console.log("Updating network with:", { coverageRadius, sensorsActive });
      alert("Network updated!");
    } catch (err) {
      console.error("Error updating network:", err);
    }
  };

  return (
    <CollapsibleSection title="Sensor Network">
      <div className="space-y-6">
        {/* Network Settings Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-300">Network Settings</h3>
          <label className="block text-gray-300 text-sm">
            Coverage Radius (km): {coverageRadius}
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={coverageRadius}
            onChange={(e) => setCoverageRadius(Number(e.target.value))}
            className="w-full"
            title="Coverage Radius"
          />
          <div className="flex items-center space-x-3">
            <label className="text-gray-300 text-sm">Activate Sensors</label>
            <input
              type="checkbox"
              checked={sensorsActive}
              onChange={(e) => setSensorsActive(e.target.checked)}
              className="form-checkbox h-5 w-5 text-[#c1ff72] bg-[#1a1a1a] border-gray-700 rounded-sm"
              title="Activate Sensors"
            />
          </div>
          <button
            onClick={handleUpdateNetwork}
            className="w-full bg-[#c1ff72] text-black font-bold py-2 rounded-md hover:bg-[#d1ff7f]"
          >
            Update Network
          </button>
        </div>

        {/* CSV Upload Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-300">Upload Nodes CSV</h3>
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvChange}
            className="w-full text-gray-300"
            title="Upload CSV file"
          />
          <button
            onClick={handleUploadCsv}
            className="w-full bg-[#c1ff72] text-black font-bold py-2 rounded-md hover:bg-[#d1ff7f]"
          >
            Upload CSV
          </button>
          {uploadStatus && (
            <p className="text-sm text-gray-300">{uploadStatus}</p>
          )}
        </div>

        {/* Add New Node Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-300">Add New Node</h3>
          <input
            type="text"
            name="source_id"
            placeholder="Source ID"
            value={newNode.source_id}
            onChange={handleNewNodeChange}
            className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded-md text-white"
          />
          <input
            type="text"
            name="location_name"
            placeholder="Location Name"
            value={newNode.location_name}
            onChange={handleNewNodeChange}
            className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded-md text-white"
          />
          <input
            type="number"
            name="latitude"
            placeholder="Latitude"
            value={newNode.latitude}
            onChange={handleNewNodeChange}
            className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded-md text-white"
          />
          <input
            type="number"
            name="longitude"
            placeholder="Longitude"
            value={newNode.longitude}
            onChange={handleNewNodeChange}
            className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded-md text-white"
          />
          <button
            onClick={handleAddNode}
            className="w-full bg-[#c1ff72] text-black font-bold py-2 rounded-md hover:bg-[#d1ff7f]"
          >
            Add Node
          </button>
          {addNodeStatus && (
            <p className="text-sm text-gray-300">{addNodeStatus}</p>
          )}
        </div>

        {/* Node List Management Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-300">Manage Nodes</h3>
          <button
            onClick={fetchNodes}
            className="w-full bg-[#c1ff72] text-black font-bold py-2 rounded-md hover:bg-[#d1ff7f]"
          >
            Refresh Nodes
          </button>
          {fetchStatus && (
            <p className="text-sm text-gray-300">{fetchStatus}</p>
          )}
          {nodes.length > 0 ? (
            <ul className="space-y-2">
              {nodes.map((node) => (
                <li
                  key={node.id}
                  className="p-2 bg-[#1a1a1a] border border-gray-700 rounded-md flex justify-between items-center"
                >
                  <div>
                    <p className="text-gray-300">
                      {node.location_name} (ID: {node.source_id})
                    </p>
                    {healthStatus[node.id] && (
                      <p className="text-sm text-green-400">
                        Health: {healthStatus[node.id]}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleGetNodeHealth(node.id)}
                      className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600 text-sm"
                    >
                      Get Health
                    </button>
                    <button
                      onClick={() => handleDeleteNode(node.id)}
                      className="bg-red-600 text-white py-1 px-2 rounded-md hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-300 text-sm">No nodes found.</p>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default SensorNetwork;
