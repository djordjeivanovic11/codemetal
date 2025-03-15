import React from "react";
import { MdExpandMore } from "react-icons/md";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="mb-4">
      <button 
        type="button" 
        onClick={() => setOpen((prev) => !prev)}
        className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-[#c1ff72] bg-[#1a1a1a] rounded-lg hover:bg-[#2c2c2c] focus:outline-none focus-visible:ring focus-visible:ring-[#c1ff72] focus-visible:ring-opacity-75"
        aria-expanded={open} 
        title="Toggle Section"
      >
        <span>{title}</span>
        <MdExpandMore
          className="w-5 h-5 text-[#c1ff72]"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
      </button>
      {open && (
        <div className="px-4 pt-4 pb-2 text-gray-300">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;
