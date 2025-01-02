"use client";
import { useState } from "react";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";

export default function UploadExcelModal({ onClose, fetchProducts }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [jsonData, setJsonData] = useState("");
  const router = useRouter();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const generateRandomQRCode = () => {
    return Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
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

          // Add QR code for each row
          const updatedData = json.map((item) => {
            return {
              ...item,
              qr_code: generateRandomQRCode(), // Add qr_code field
            };
          });

          setJsonData(JSON.stringify(updatedData, null, 2));
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleUpload = async () => {
    if (!jsonData) {
      setMessage("No data to upload. Preview the Excel file first.");
      return;
    }

    try {
      const response = await fetch("/api/productbulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: JSON.parse(jsonData) }), 
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Data successfully saved to the database!");
        fetchProducts();
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error saving to database:", error);
      setMessage("An error occurred while saving data.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 sm:w-96 p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
        >
          ×
        </button>

        <h1 className="text-xl font-semibold mb-4 text-center">Upload Excel File</h1>
        <div className="mb-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md text-sm md:text-base"
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

        {jsonData && (
          <div className="mt-6 bg-gray-200 p-4 rounded-lg overflow-auto max-h-60">
            <pre className="text-xs text-gray-700">{jsonData}</pre>
          </div>
        )}

        {/* <button
          onClick={() => router.push("/")}
          className="mt-6 bg-gray-800 text-white py-2 px-4 rounded-lg w-full hover:bg-gray-900 transition"
        >
          Back to Homepage
        </button> */}
      </div>
    </div>
  );
}
