"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

export default function UploadExcel() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [JsonData, setJsonData] = useState("");
  const router = useRouter();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const previewData = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const workSheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(workSheet);
          setJsonData(JSON.stringify(json, null, 2)); // Corrected stringification
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleUpload = async () => {
    if (!JsonData) {
      setMessage("No data to upload. Preview the Excel file first.");
      return;
    }

    try {
      const response = await fetch("/api/productbulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: JSON.parse(JsonData) }), // Send JSON data
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Data successfully saved to the database!");
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error saving to database:", error);
      setMessage("An error occurred while saving data.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-8 px-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Upload Excel File</h1>

        <div className="flex flex-col items-center mb-4">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".xlsx, .xls"
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between mt-4">
          <button
            onClick={handleUpload}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Upload
          </button>
          <button
            onClick={previewData}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
          >
            Preview Data
          </button>
        </div>

        {message && (
          <p className="mt-4 text-center text-red-500 font-medium">{message}</p>
        )}

        {JsonData && (
          <div className="mt-6 bg-gray-200 p-4 rounded-lg overflow-auto max-h-60">
            <pre className="text-xs text-gray-700">{JsonData}</pre>
          </div>
        )}

        <button
          onClick={() => router.push("/")}
          className="mt-6 bg-gray-800 text-white py-2 px-4 rounded-lg w-full hover:bg-gray-900 transition"
        >
          Back to Homepage
        </button>
      </div>
    </div>
  );
}
