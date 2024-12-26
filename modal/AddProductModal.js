"use client";
import { useEffect } from "react";
import { useProduct } from "../hooks/useProduct";

export default function AddProductModal({ onClose, fetchProducts }) {
  const { productForm, handleChange, addProduct, message } = useProduct();

  useEffect(() => {
    if (message) {
      fetchProducts();
    }
  }, [message]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    await addProduct();
  };

  // Check if all required fields are filled
  const isFormValid = [
    "model_name",
    "category",
    "variant_type",
    "qr_code",
    "buy_price",
    "sell_price",
    "wholesale_price",
    "quantity",
    "hardware_category",
    "shop_name",
  ].every((field) => productForm[field]?.trim() !== "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
        >
          ×
        </button>

        <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-center">
          Add a Product
        </h1>

        <form
          onSubmit={handleAddProduct}
          className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {[
            { name: "model_name", placeholder: "Model Name", required: true },
            { name: "category", placeholder: "Category", required: true },
            {
              name: "variant_type",
              placeholder: "Variant Type",
              type: "select",
              required: true,
              options: ["Original", "Copy", "1st Copy"],
            },
            { name: "qr_code", placeholder: "QR Code", required: true },
            { name: "buy_price", placeholder: "Buy Price", type: "number", required: true },
            { name: "sell_price", placeholder: "Sell Price", type: "number", required: true },
            {
              name: "wholesale_price",
              placeholder: "Wholesale Price",
              type: "number",
              required: true,
            },
            { name: "quantity", placeholder: "Quantity", type: "number", required: true },
            {
              name: "hardware_category",
              placeholder: "Hardware Category",
              required: true,
            },
            { name: "shop_name", placeholder: "Shop Name", required: true },
            { name: "address", placeholder: "Shop Address (Optional)" },
          ].map((field) =>
            field.type === "select" ? (
              <select
                key={field.name}
                name={field.name}
                value={productForm[field.name] || ""}
                onChange={handleChange}
                required={field.required}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
              >
                <option value="" disabled>
                  {field.placeholder}
                </option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <div key={field.name} className="relative">
                <input
                  name={field.name}
                  value={productForm[field.name] || ""}
                  onChange={handleChange}
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                  required={field.required}
                />
                {field.required && (
                  <span className="text-red-500 absolute top-2 right-2">*</span>
                )}
              </div>
            )
          )}

          <button
            type="submit"
            disabled={!isFormValid}
            className={`col-span-1 sm:col-span-2 lg:col-span-3 font-semibold p-3 rounded-md text-sm sm:text-base ${
              isFormValid
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Add Product
          </button>
        </form>

        {message && (
          <p className="text-green-500 mt-4 text-center text-sm sm:text-base">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
