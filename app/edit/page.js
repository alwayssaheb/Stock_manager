"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EditProduct() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id"); // Get the product ID from the URL query

  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    model_name: "",
    category: "",
    variant_type: "",
    qr_code: "",
    buy_price: "",
    sell_price: "",
    wholesale_price: "",
    quantity: "",
    hardware_category: "",
    shop_name: "",
    address: "",
  });
  const [message, setMessage] = useState("");

  // Fetch the product details on page load
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/findbyid/${productId}`);
         console.log("*****************************",response);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        console.log("^^^^^^^^^^^^^^^^^^^^^^^", data);
        setProduct(data.product);

        // Populate the form with fetched product details
        setFormData({
          model_name: data.product?.model_id?.model_name || "",
          category: data.product?.category || "",
          variant_type: data.product?.variant_type || "",
          qr_code: data.product?.qr_code || "",
          buy_price: data.product?.buy_price || "",
          sell_price: data.product?.sell_price || "",
          wholesale_price: data.product?.wholesale_price || "",
          quantity: data.product?.quantity || "",
          hardware_category: data.product?.hardware_category || "",
          shop_name: data.product?.shop_number?.shop_name || "",
          address: data.product?.shop_number?.address || "",
        });
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/findbyid/${productId}`, {
        method: "PUT", // Use PUT for updating
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Product updated successfully!");
        router.push("/"); // Redirect to home page after updating
      } else {
        setMessage(`Error: ${result.error || "Failed to update product"}`);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setMessage("An error occurred while updating the product.");
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      {product ? (
        <form onSubmit={handleSubmit} className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
              value={formData[field.name]}
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
            Update Product
          </button>
        </form>
      ) : (
        <p>Loading product details...</p>
      )}
      <p className="mt-4 text-green-500">{message}</p>
    </div>
  );
}
