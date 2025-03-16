import React, { useState, ChangeEvent } from "react";
import CollapsibleSection from "@/components/UI/Dashboard/ControlPanel/CollapsibleSection";

const DetectionsUpload: React.FC = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleCsvChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!csvFile) {
      setUploadStatus("Please select a CSV file.");
      return;
    }
    setUploadStatus("Uploading...");
    try {
      const formData = new FormData();
      formData.append("file", csvFile);

      const response = await fetch("/api/detections/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setUploadStatus(data.message || "Upload successful.");
      // Optionally, trigger further actions with the uploaded data here.
    } catch (err) {
      console.error("Error uploading CSV:", err);
      setUploadStatus("Upload failed.");
    }
  };

  return (
    <CollapsibleSection title="Upload Detections CSV">
      <div className="p-4 bg-[#1a1a1a] rounded-md shadow-md space-y-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleCsvChange}
          className="w-full text-gray-300"
          title="Select CSV file for detections"
        />
        <button
          onClick={handleUpload}
          className="w-full bg-[#c1ff72] text-black font-bold py-2 rounded-md hover:bg-[#d1ff7f]"
        >
          Upload CSV
        </button>
        {uploadStatus && (
          <p className="text-sm text-gray-300">{uploadStatus}</p>
        )}
      </div>
    </CollapsibleSection>
  );
};

export default DetectionsUpload;
