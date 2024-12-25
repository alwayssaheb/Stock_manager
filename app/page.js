"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import StockTable from "../component/StockTable";
import { useProduct } from "../hooks/useProduct";
import AddProductModal from "../modal/AddProductModal";
import UploadExcelModal from "../modal/UploadExcelModal";
import { FaTrash, FaEdit } from "react-icons/fa"; 

export default function Home() {
  const { authUser } = useAuth();
  const { products, fetchProducts, deleteProduct } = useProduct();

  const [search, setSearch] = useState("");
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isUploadExcelModalOpen, setIsUploadExcelModalOpen] = useState(false);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const filteredRecords = products.filter((record) => {
    const searchTerm = search.toLowerCase();
    if (searchTerm === "") return true;
    return (
      record.model_id?.model_name?.toLowerCase().includes(searchTerm) ||
      record.variant_type?.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 overflow-x-auto">
        {/* Buttons */}
        <div className="flex flex-wrap gap-4 mb-6 justify-center md:justify-start">
          <button
            onClick={() => setIsAddProductModalOpen(true)}
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 text-xs sm:text-sm md:text-base"
          >
            Add a Product
          </button>
          <button
            onClick={() => setIsUploadExcelModalOpen(true)}
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 text-xs sm:text-sm md:text-base"
          >
            Upload an Excel File
          </button>
          <Link href="/scan">
            <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 text-xs sm:text-sm md:text-base">
              Scan QR Code
            </button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-4 border-2 border-gray-300 rounded-lg shadow-lg text-sm md:text-base"
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        {/* Current Stock */}
        <div className="container mx-auto bg-white shadow-md rounded-lg overflow-x-auto">
          <StockTable products={filteredRecords} deleteProduct={deleteProduct} />
        </div>
      </div>

      {/* Modals */}
      {isAddProductModalOpen && (
        <AddProductModal onClose={() => setIsAddProductModalOpen(false)} fetchProducts={fetchProducts} />
      )}
      {isUploadExcelModalOpen && (
        <UploadExcelModal onClose={() => setIsUploadExcelModalOpen(false)} fetchProducts={fetchProducts} />
      )}
    </>
  );
}
