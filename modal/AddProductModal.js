"use client";
import { useEffect } from "react";
import { useProduct } from "../hooks/useProduct";

export default function AddProductModal({ onClose, fetchProducts }) {
  const { productForm, handleChange, addProduct, message } = useProduct();

  // Sync with product addition and fetch updated products
  useEffect(() => {
    if (message) {
      fetchProducts(); // Call fetchProducts when message changes (indicating success)
    }
  }, [message, fetchProducts]); // Depend on message, which indicates the addProduct status

  const handleAddProduct = async (e) => {
    e.preventDefault();
    await addProduct(); // Call the existing addProduct function
  };

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

        <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Add a Product</h1>

        {/* Form */}
        <form
          onSubmit={handleAddProduct} // Use the existing addProduct function on submit
          className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {[
            { name: "model_name", placeholder: "Model Name" },
            { name: "category", placeholder: "Category" },
            { name: "variant_type", placeholder: "Variant Type" },
            { name: "qr_code", placeholder: "QR Code" },
            { name: "buy_price", placeholder: "Buy Price", type: "number" },
            { name: "sell_price", placeholder: "Sell Price", type: "number" },
            { name: "wholesale_price", placeholder: "Wholesale Price", type: "number" },
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
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
            />
          ))}

          <button
            type="submit"
            className="col-span-1 sm:col-span-2 lg:col-span-3 bg-blue-500 text-white font-semibold p-3 rounded-md hover:bg-blue-600 text-sm sm:text-base"
          >
            Add Product
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="text-green-500 mt-4 text-center text-sm sm:text-base">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
