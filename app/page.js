"use client";
import Image from "next/image";
import Header from "../components/Header";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useProduct } from "../hooks/useProduct"; // Assuming you put the hook in a hooks folder
import StockTable from "../component/StockTable"; // Import the StockTable component

export default function Home() {
  const { authUser } = useAuth();
  const router = useRouter();
  const {
    products,
    message,
    fetchProducts,
    addProduct,
    deleteProduct,
    productForm,
    setProductForm,
    handleChange,
  } = useProduct();

  return (
    <>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 overflow-x-auto"> {/* Added overflow-x-auto to container */}
        {/* Search Product Section */}
        <button
          className="bg-blue-500 rounded w-full h-10"
          onClick={() => router.push("/search")}
        >
          Search
        </button>

        {/* Add Product Section */}
        <div className="mb-8">
          <h1 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-4 mt-4">
            Add a Product
          </h1>
          <form
            onSubmit={addProduct}
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              { name: "model_name", placeholder: "Model Name" },
              { name: "category", placeholder: "Category" },
              { name: "variant_type", placeholder: "Variant Type" },
              { name: "qr_code", placeholder: "QR Code" },
              { name: "buy_price", placeholder: "Buy Price", type: "number" },
              { name: "sell_price", placeholder: "Sell Price", type: "number" },
              {
                name: "wholesale_price",
                placeholder: "Wholesale Price",
                type: "number",
              },
              { name: "quantity", placeholder: "Quantity", type: "number" },
              { name: "hardware_category", placeholder: "Hardware Category" },
              { name: "shop_name", placeholder: "Shop Name" },
              { name: "address", placeholder: "Shop Address (Optional)" },
            ].map((field) => (
              <input
                key={field.name}
                name={field.name}
                value={productForm[field.name] || ""}
                onChange={handleChange}
                type={field.type || "text"}
                placeholder={field.placeholder}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ))}

            <button
              type="submit"
              className="col-span-1 sm:col-span-2 lg:col-span-3 bg-blue-500 text-white font-semibold p-3 rounded-md hover:bg-blue-600"
            >
              Add Product
            </button>
          </form>
          <p className="text-green-500 mt-2">{message}</p>
        </div>

        {/* Role-based Button for Admin */}
        <div className="flex mb-4">
          <div>
            {authUser?.role === "Admin" && (
              <Link href="/upload">
                <button className="mr-4 col-span-1 sm:col-span-2 lg:col-span-3 bg-blue-500 text-white font-semibold p-3 rounded-md hover:bg-blue-600">
                  Upload an Excel File
                </button>
              </Link>
            )}
          </div>
          <div>
            <Link href="/scan">
              <button className="col-span-1 sm:col-span-2 lg:col-span-3 bg-blue-500 text-white font-semibold p-3 rounded-md hover:bg-blue-600">
                Scan QR Code
              </button>
            </Link>
          </div>
        </div>

        {/* Display Current Stock Section */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Current Stock
        </h1>
        <StockTable products={products} deleteProduct={deleteProduct} /> {/* Using the StockTable Component */}
        
      </div>
    </>
  );
}
