"use client";

import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface ControlPanelItemProps {
  title: string;
  children: React.ReactNode;
}

const ControlPanelItem: React.FC<ControlPanelItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-4 border-b border-gray-700 pb-2">
      {/* Collapsible Toggle Button */}
      <button
        className="w-full flex justify-between items-center text-white text-lg font-semibold py-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
      </button>

      {/* Content */}
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  );
};

export default ControlPanelItem;
