"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QRCodeScanner() {
  const [scannedData, setScannedData] = useState(null); // To store scanned QR code data
  const [syncError, setSyncError] = useState(null); // To handle sync errors
  const [syncSuccess, setSyncSuccess] = useState(null); // To display success message
  const [product, setProduct] = useState(null); // To store product details
  const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility
  const scannerRef = useRef(null); // Reference to the scanner div
  const qrCodeScannerRef = useRef(null); // Reference to the Html5QrcodeScanner instance

  useEffect(() => {
    const qrCodeScanner = new Html5QrcodeScanner(
      "qr-reader", // ID of the div where the scanner will render
      {
        fps: 10, // Frames per second for scanning
        qrbox: (viewfinderWidth, viewfinderHeight) => {
          // Dynamically adjust the scanner box size based on the device
          const size = Math.min(viewfinderWidth, viewfinderHeight) * 0.6;
          return { width: size, height: size };
        },
      },
      false // Disable verbose logging
    );

    // Store the scanner reference for cleanup
    qrCodeScannerRef.current = qrCodeScanner;

    // Start rendering the scanner
    qrCodeScanner.render(
      (decodedText) => {
        if (!scannedData) { // Prevent multiple scans if already scanned
          setScannedData(decodedText);
          syncScannedData(decodedText); // Sync scanned data with backend
          qrCodeScannerRef.current?.clear(); // Stop scanning after success
        }
      },
      (error) => {
        console.warn(`QR code scan error: ${error}`);
        // Check if the error is related to the QR code parsing
        if (error instanceof Error && error.message.includes("NotFoundException")) {
          console.log("QR code not detected properly, please try again.");
        }
      }
    );

    // Cleanup on component unmount
    return () => {
      if (qrCodeScannerRef.current) {
        qrCodeScannerRef.current.clear().catch((err) => {
          console.error("Failed to clear QR Code Scanner", err);
        });
      }
    };
  }, [scannedData]); // Depend on scannedData to prevent multiple scans

  const syncScannedData = async (qrCode) => {
    try {
      setSyncError(null); // Reset errors
      setSyncSuccess(null); // Reset success message
      const response = await fetch(`/api/scan?QR_Code=${encodeURIComponent(qrCode)}`);
      const result = await response.json();
      console.log(result);

      if (response.ok) {
        setProduct(result.product); // Store product details
        setIsModalOpen(true); // Open modal on success
        setSyncSuccess(`Product Found: ${result.product.slug}`);
      } else {
        setSyncError(result.error || "Failed to fetch product data.");
      }
    } catch (error) {
      setSyncError("An error occurred while syncing with the server.");
      console.error("Sync Error:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal when the cross button is clicked
    setProduct(null); // Clear product details
    setScannedData(null); // Clear scanned data to reset for the next scan
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
        Scan QR Code
      </h1>
      <div
        id="qr-reader"
        className="w-full max-w-md h-[300px] bg-white shadow-md rounded-md overflow-hidden"
        ref={scannerRef}
      ></div>

      {scannedData && (
        <div className="mt-6 bg-blue-50 p-4 rounded-md shadow-md max-w-md w-full">
          <h2 className="text-lg font-semibold text-gray-700 text-center">
            Scanned Data:
          </h2>
          <p className="text-blue-600 text-center break-all">{scannedData}</p>
        </div>
      )}

      {syncSuccess && (
        <div className="mt-4 bg-green-50 p-4 rounded-md shadow-md max-w-md w-full text-center">
          <p className="text-green-700">{syncSuccess}</p>
        </div>
      )}
      {syncError && (
        <div className="mt-4 bg-red-50 p-4 rounded-md shadow-md max-w-md w-full text-center">
          <p className="text-red-700">{syncError}</p>
        </div>
      )}

      {/* Modal/Popup to display product details */}
      {isModalOpen && product && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-[90%] md:w-[400px] relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              &times; {/* Cross icon */}
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Details</h2>
            <p><strong>Product Name:</strong> {product.Product_name}</p>
            <p><strong>Model Number:</strong> {product.Model_number}</p>
            <p><strong>EMIE Number:</strong> {product.EMIE_number}</p>
            <p><strong>Quantity:</strong> {product.Quantity}</p>
            <p><strong>Price:</strong> ${product.Price}</p>
            <p><strong>Category:</strong> {product.Category}</p>
            <p><strong>QR Code:</strong> {product.QR_Code}</p>
          </div>
        </div>
      )}
    </div>
  );
}
