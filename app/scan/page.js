"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QRCodeScanner() {
  const [scannedData, setScannedData] = useState(null);
  const [syncError, setSyncError] = useState(null);
  const [syncSuccess, setSyncSuccess] = useState(null);
  const [product, setProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scannerRef = useRef(null);
  const qrCodeScannerRef = useRef(null);

  useEffect(() => {
    const qrCodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: (viewfinderWidth, viewfinderHeight) => {
          const size = Math.min(viewfinderWidth, viewfinderHeight) * 0.6;
          return { width: size, height: size };
        },
      },
      false
    );

    qrCodeScannerRef.current = qrCodeScanner;

    qrCodeScanner.render(
      (decodedText) => {
        if (!scannedData) {
          setScannedData(decodedText);
          syncScannedData(decodedText);
          qrCodeScannerRef.current?.clear();
        }
      },
      (error) => {
        console.warn(`QR code scan error: ${error}`);

        if (
          error instanceof Error &&
          error.message.includes("NotFoundException")
        ) {
          console.log("QR code not detected properly, please try again.");
        }
      }
    );

    return () => {
      if (qrCodeScannerRef.current) {
        qrCodeScannerRef.current.clear().catch((err) => {
          console.error("Failed to clear QR Code Scanner", err);
        });
      }
    };
  }, [scannedData]);

  const syncScannedData = async (qrCode) => {
    try {
      setSyncError(null);
      setSyncSuccess(null);
      const response = await fetch(
        `/api/scan?QR_Code=${encodeURIComponent(qrCode)}`
      );
      const result = await response.json();
      console.log(result);

      if (response.ok) {
        setProduct(result.product);
        setIsModalOpen(true);
        setSyncSuccess(`Product Found: ${result.product.model_name}`);
      } else {
        setSyncError(result.error || "Failed to fetch product data.");
      }
    } catch (error) {
      setSyncError("An error occurred while syncing with the server.");
      console.error("Sync Error:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProduct(null);
    setScannedData(null);
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

      {isModalOpen && product && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-[90%] md:w-[600px] max-w-full relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              &times; {/* Cross icon */}
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Product Details
            </h2>
            <table className="table-auto w-full text-left text-gray-700">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Model Name</th>
                  <th className="border px-2 py-1">Variant Type</th>
                  <th className="border px-2 py-1">QR Code</th>
                  <th className="border px-2 py-1">Buy Price</th>
                  <th className="border px-2 py-1">Sell Price</th>
                  <th className="border px-2 py-1">Wholesale Price</th>
                  <th className="border px-2 py-1">Quantity</th>
                  <th className="border px-2 py-1">Hardware Category</th>
                  <th className="border px-2 py-1">Shop Name</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-2 py-1">{product.model_name}</td>
                  <td className="border px-2 py-1">{product.variant_type}</td>
                  <td className="border px-2 py-1">{product.qr_code}</td>
                  <td className="border px-2 py-1">{product.buy_price}</td>
                  <td className="border px-2 py-1">{product.sell_price}</td>
                  <td className="border px-2 py-1">
                    {product.wholesale_price}
                  </td>
                  <td className="border px-2 py-1">{product.quantity}</td>
                  <td className="border px-2 py-1">
                    {product.hardware_category}
                  </td>
                  <td className="border px-2 py-1">
                    {product.shop_name}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
