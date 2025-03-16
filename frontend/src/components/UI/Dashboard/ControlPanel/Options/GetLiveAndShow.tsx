import React from "react";
import { getLiveData } from "@/api/live/route";

const GetLiveButton: React.FC = () => {
  const handleGetLiveData = async () => {
    try {
      const blob = await getLiveData();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error fetching live data:", error);
    }
  };

  return (
    <button
      onClick={handleGetLiveData}
      className="bg-[#c1ff72] text-black font-bold py-2 px-4 rounded-md hover:bg-[#d1ff7f]"
    >
      Get Live
    </button>
  );
};

export default GetLiveButton;
