import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export default function QRCodeModal({ productId, closeModal }) {
  const [qrCodeImage, setQrCodeImage] = useState(null); // State to hold the QR code image

  useEffect(() => {
    if (productId?.qr_code) {
     
      QRCode.toDataURL(productId.qr_code) // Generate QR code for the 4-digit number
        .then((url) => setQrCodeImage(url)) // Set the base64 string in the state
        .catch((error) => console.error("Error generating QR code", error));
    }
  }, [productId]);

  const downloadQRCode = () => {
    if (!qrCodeImage) {
      console.error("No QR Code found");
      return;
    }

    try {
      // Create a PDF with the QR code image
      const pdf = new jsPDF();
      pdf.text("QR Code for Product", 10, 10);

      // Add the QR code image to the PDF (size: 50x50)
      pdf.addImage(qrCodeImage, "PNG", 10, 20, 100, 100); 
      pdf.save(`${productId.model_id?.model_name || "product"}-QR.pdf`); // Save the PDF with dynamic name
    } catch (error) {
      console.error("Error downloading QR Code PDF:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Download QR Code</h2>
        <p>Click the button below to download the QR Code for {productId.model_id?.model_name || "Product"}.</p>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={closeModal}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
          <button
            onClick={downloadQRCode}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Download QR Code
          </button>
        </div>
      </div>
    </div>
  );
}
