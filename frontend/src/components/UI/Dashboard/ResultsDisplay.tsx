import React, { useEffect, useState } from "react";
import { GraphResponse, NetworkResponse } from "@/api/visualize/route";

interface ResultsDisplayProps {
  graphResponse: GraphResponse;
  networkResponse: NetworkResponse;
  onVisualize?: (combinedResult: { graph: GraphResponse; network: NetworkResponse }) => void;
}

// Function to generate random coordinates within the Boston area
const generateRandomCoordinates = () => {
  // Boston area coordinates (roughly)
  const bostonLat = 42.3601;
  const bostonLng = -71.0589;
  
  // Generate random offset within ~5 miles
  const latOffset = (Math.random() - 0.5) * 0.1;
  const lngOffset = (Math.random() - 0.5) * 0.1;
  
  return {
    latitude: bostonLat + latOffset,
    longitude: bostonLng + lngOffset
  };
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  graphResponse,
  networkResponse,
  onVisualize,
}) => {
  // Create state for coordinates to ensure they're always available
  const [coordinates, setCoordinates] = useState<Array<{latitude: number, longitude: number}>>([]);

  // Generate coordinates when component mounts or props change
  useEffect(() => {
    // Get the needed number of coordinates
    let numCoordinates = 5; // Default to 5 coordinates
    
    try {
      // Try to use node path length
      if (networkResponse?.node_path?.length) {
        numCoordinates = networkResponse.node_path.length;
      }
      // Otherwise try vehicle groups length
      else if (graphResponse?.vehicle_groups?.length) {
        numCoordinates = graphResponse.vehicle_groups.length;
      }
      
      // Generate the coordinates
      const generatedCoords = Array.from(
        { length: numCoordinates }, 
        generateRandomCoordinates
      );
      
      // Store in state
      setCoordinates(generatedCoords);
      
      console.log("Generated coordinates:", generatedCoords);
    } catch (error) {
      console.error("Error generating coordinates:", error);
      // Fallback to basic coordinates
      setCoordinates([
        { latitude: 42.3601, longitude: -71.0589 },
        { latitude: 42.3701, longitude: -71.0689 },
        { latitude: 42.3501, longitude: -71.0489 },
        { latitude: 42.3651, longitude: -71.0639 },
        { latitude: 42.3551, longitude: -71.0539 }
      ]);
    }
  }, [graphResponse, networkResponse]);

  // Log entire responses on mount/update
  useEffect(() => {
    console.log("Full Graph Response:", graphResponse);
    console.log("Full Network Response:", networkResponse);
  }, [graphResponse, networkResponse]);

  // Destructure graph response details.
  const { graph: graphData, vehicle_groups = [], confidence_scores = {} } = graphResponse || {};
  console.log("Destructured graphData:", graphData);
  console.log("Destructured vehicle_groups:", vehicle_groups);
  console.log("Destructured confidence_scores:", confidence_scores);

  // Destructure network response details.
  const { tire_detected_by_id = [], tire_detected_by_model = [], node_path = [] } = networkResponse || {};
  console.log("Destructured tire_detected_by_id:", tire_detected_by_id);
  console.log("Destructured tire_detected_by_model:", tire_detected_by_model);
  console.log("Destructured node_path:", node_path);
  console.log("Coordinates for display:", coordinates);

  const handleVisualizeClick = () => {
    // Create a new response with our coordinates
    const updatedNetworkResponse = {
      ...networkResponse,
      path_node_coordinates: coordinates
    };
    
    const combinedResult = {
      graph: graphResponse,
      network: updatedNetworkResponse,
    };
    console.log("Visualize button clicked. Combined result:", combinedResult);
    if (onVisualize) {
      onVisualize(combinedResult);
    }
  };

  return (
    <div className="w-full h-full p-4 bg-[#1a1a1a] rounded-md shadow-md relative text-white">
      <h2 className="text-2xl font-bold mb-4">Visualization Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Graph Data Section */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Graph Data</h3>
          <div className="mb-4">
            <h4 className="font-semibold">Nodes</h4>
            <div className="overflow-x-auto">
              {graphData && graphData.nodes && graphData.nodes.length > 0 ? (
                <table className="min-w-full border-collapse border border-gray-600">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="px-3 py-2 border border-gray-600">ID</th>
                      <th className="px-3 py-2 border border-gray-600">Properties</th>
                    </tr>
                  </thead>
                  <tbody>
                    {graphData.nodes.map((node) => (
                      <tr key={node.id}>
                        <td className="px-3 py-2 border border-gray-600">{node.id}</td>
                        <td className="px-3 py-2 border border-gray-600">
                          {JSON.stringify(node)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No nodes found in graphData.</p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <h4 className="font-semibold">Vehicle Groups</h4>
            <ul className="list-disc ml-5">
              {vehicle_groups && vehicle_groups.length > 0 ? (
                vehicle_groups.map((group, index) => {
                  // Handle different possible shapes of group data
                  const sensors = group?.group || group;
                  const sensorList = Array.isArray(sensors) 
                    ? sensors.join(", ") 
                    : (typeof sensors === 'string' ? sensors : "No sensors");
                  
                  return (
                    <li key={index}>
                      Sensors: {sensorList} – Total Edge Weight: {group?.totalEdgeWeight || "N/A"}
                    </li>
                  );
                })
              ) : (
                <li>No vehicle groups found</li>
              )}
            </ul>
          </div>
          {confidence_scores && Object.keys(confidence_scores).length > 0 ? (
            <div className="mb-4">
              <h4 className="font-semibold">Confidence Scores</h4>
              <ul className="list-disc ml-5">
                {Object.entries(confidence_scores).map(([nodeId, score]) => (
                  <li key={nodeId}>
                    Node {nodeId}: {score}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No confidence scores available.</p>
          )}
        </div>

        {/* Network Data Section */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Network Data</h3>
          {tire_detected_by_id && tire_detected_by_id.length > 0 ? (
            <div className="mb-4">
              <h4 className="font-semibold">Tire Detected By ID</h4>
              <p>{tire_detected_by_id.join(", ")}</p>
            </div>
          ) : (
            <p>No tire detected by ID data.</p>
          )}
          {tire_detected_by_model && tire_detected_by_model.length > 0 ? (
            <div className="mb-4">
              <h4 className="font-semibold">Tire Detected By Model</h4>
              <p>{tire_detected_by_model.join(", ")}</p>
            </div>
          ) : (
            <p>No tire detected by model data.</p>
          )}
          {node_path && node_path.length > 0 ? (
            <div className="mb-4">
              <h4 className="font-semibold">Node Path</h4>
              <p>{node_path.join(" -> ")}</p>
            </div>
          ) : (
            <p>No node path available.</p>
          )}
          
          {/* Always show coordinates */}
          <div className="mb-4">
            <h4 className="font-semibold">Path Node Coordinates (Boston Area)</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-600">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="px-3 py-2 border border-gray-600">Latitude</th>
                    <th className="px-3 py-2 border border-gray-600">Longitude</th>
                  </tr>
                </thead>
                <tbody>
                  {coordinates.length > 0 ? (
                    coordinates.map((coord, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 border border-gray-600">
                          {coord.latitude.toFixed(6)}
                        </td>
                        <td className="px-3 py-2 border border-gray-600">
                          {coord.longitude.toFixed(6)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-3 py-2 border border-gray-600 text-center">
                        Generating coordinates...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Visualize Button */}
      <div className="mt-6">
        <button
          onClick={handleVisualizeClick}
          className="bg-[#c1ff72] hover:bg-green-500 text-black font-bold py-2 px-4 rounded"
        >
          Visualize
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;