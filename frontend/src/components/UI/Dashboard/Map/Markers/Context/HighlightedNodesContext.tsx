// src/components/UI/Dashboard/Map/Markers/Context/HighlightedNodesContext.tsx
import React, { createContext, useContext, useState } from "react";

export interface HighlightedNode {
  id: string;
  position: google.maps.LatLngLiteral;
}

interface HighlightedNodesContextValue {
  highlightedNodes: HighlightedNode[];
  setHighlightedNodes: (nodes: HighlightedNode[]) => void;
}

const HighlightedNodesContext = createContext<HighlightedNodesContextValue>({
  highlightedNodes: [],
  setHighlightedNodes: () => {},
});

interface HighlightedNodesProviderProps {
  children: React.ReactNode;
}

export const HighlightedNodesProvider: React.FC<HighlightedNodesProviderProps> = ({ children }) => {
  const [highlightedNodes, setHighlightedNodes] = useState<HighlightedNode[]>([]);
  return (
    <HighlightedNodesContext.Provider value={{ highlightedNodes, setHighlightedNodes }}>
      {children}
    </HighlightedNodesContext.Provider>
  );
};

export const useHighlightedNodes = () => useContext(HighlightedNodesContext);
