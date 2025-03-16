import React from "react";
import { GraphResponse, NetworkResponse } from "@/api/visualize/route";

interface ResultsDisplayProps {
  graphResponse: GraphResponse;
  networkResponse: NetworkResponse;
  onVisualize?: (combinedResult: { graph: GraphResponse; network: NetworkResponse }) => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  graphResponse,
  networkResponse,
  onVisualize,
}) => {
  // Destructure graph response details.
  const { graph: graphData, vehicle_groups, confidence_scores } = graphResponse;
  const graphNodes = graphData.nodes;

  // Destructure network response details.
  const { tire_detected_by_id, tire_detected_by_model, node_path, path_node_coordinates } = networkResponse;

  const handleVisualizeClick = () => {
    const combinedResult = {
      graph: graphResponse,
      network: networkResponse,
    };
    if (onVisualize) {
      onVisualize(combinedResult);
    } else {
      console.log("Combined result:", combinedResult);
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
              <table className="min-w-full border-collapse border border-gray-600">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="px-3 py-2 border border-gray-600">ID</th>
                    <th className="px-3 py-2 border border-gray-600">Properties</th>
                  </tr>
                </thead>
                <tbody>
                  {graphNodes.map((node) => (
                    <tr key={node.id}>
                      <td className="px-3 py-2 border border-gray-600">{node.id}</td>
                      <td className="px-3 py-2 border border-gray-600">
                        {JSON.stringify(node)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {vehicle_groups && vehicle_groups.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold">Vehicle Groups</h4>
              <ul className="list-disc ml-5">
                {vehicle_groups.map((group, index) => (
                  <li key={index}>
                    Sensors: {group.group.join(", ")} – Total Edge Weight: {group.totalEdgeWeight}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {confidence_scores && Object.keys(confidence_scores).length > 0 && (
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
          )}
        </div>

        {/* Network Data Section */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Network Data</h3>
          {tire_detected_by_id && tire_detected_by_id.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold">Tire Detected By ID</h4>
              <p>{tire_detected_by_id.join(", ")}</p>
            </div>
          )}
          {tire_detected_by_model && tire_detected_by_model.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold">Tire Detected By Model</h4>
              <p>{tire_detected_by_model.join(", ")}</p>
            </div>
          )}
          {node_path && node_path.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold">Node Path</h4>
              <p>{node_path.join(" -> ")}</p>
            </div>
          )}
          {path_node_coordinates && path_node_coordinates.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold">Path Node Coordinates</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-600">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="px-3 py-2 border border-gray-600">Latitude</th>
                      <th className="px-3 py-2 border border-gray-600">Longitude</th>
                    </tr>
                  </thead>
                  <tbody>
                    {path_node_coordinates.map((coord, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 border border-gray-600">{coord.latitude}</td>
                        <td className="px-3 py-2 border border-gray-600">{coord.longitude}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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
