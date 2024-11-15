"use client";
import Image from "next/image";
import Header from "../components/Header";
import { useState, useEffect } from "react";

export default function Home() {
  const [ProductForm, setProductForm] = useState({
    slug: "",
    EMIE_number: "",
    Model_number: "",
    item_id: "",
    Product_name: "",
    Quantity: "",
    Price: "",
    Category: "",
    QR_Code: "",
  });
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("/api/product");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const rjson = await response.json();
        if (Array.isArray(rjson.products)) {
          setProducts(rjson.products);
        } else {
          console.error("Invalid response format: products is not an array");
          setProducts([]); // Fallback to an empty array
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]); // Fallback to an empty array
      }
    };

    fetchProduct();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();
  
    // Ensure that ProductForm is not empty
    if (!ProductForm.slug || !ProductForm.Product_name || !ProductForm.Quantity || !ProductForm.Price) {
      setMessage("Please fill in all required fields.");
      return;
    }
  
    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ProductForm),
      });
  
      if (!response.ok) {
        const errorResult = await response.json();
        console.error("API Error:", errorResult);
        throw new Error(errorResult.error || "Failed to add product");
      }
  
      const result = await response.json();
      console.log(result);
      setMessage("Product added successfully!"); 
     
      setProducts((prevProducts) => [...prevProducts, result.product]);
     
    } catch (error) {
      console.error("Add product error:", error);
      setMessage(`Error: ${error.message}`);
      
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 bg-gray-50">
        {/* Search Product Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center space-x-4">
            <span>Search a Product</span>
            <input
              type="text"
              placeholder="Type to search..."
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/2"
            />
            <select className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="hardware">Hardware</option>
              <option value="furniture">Furniture</option>
            </select>
          </h1>
        </div>

        {/* Add Product Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            Add a Product
          </h1>
          <form
            onSubmit={addProduct}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <input
              name="slug"
              value={ProductForm.slug}
              onChange={handleChange}
              type="text"
              placeholder="Item Name"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="EMIE_number"
              onChange={handleChange}
              type="text"
              placeholder="EMIE Number"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="Model_number"
              onChange={handleChange}
              type="text"
              placeholder="Model Number"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="item_id"
              onChange={handleChange}
              type="text"
              placeholder="Item ID (backend use)"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              onChange={handleChange}
              name="Product_name"
              type="text"
              placeholder="Product Name"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="Quantity"
              onChange={handleChange}
              type="number"
              placeholder="Quantity (in stock)"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="Price"
              onChange={handleChange}
              type="text"
              placeholder="Price (per unit)"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="Category"
              onChange={handleChange}
              type="text"
              placeholder="Category (e.g., electronics, hardware)"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="QR_Code"
              onChange={handleChange}
              type="text"
              placeholder="QR Code"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="col-span-1 sm:col-span-2 lg:col-span-3 bg-blue-500 text-white font-semibold p-3 rounded-md hover:bg-blue-600"
            >
              Add Product
            </button>
          </form>
          <p className="text-green-500 mt-2">{message}</p> {/* Success/Error Message */}
        </div>

        {/* Display Current Stock Section */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Current Stock
        </h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Item Name</th>
                <th className="px-4 py-3 text-left">EMIE Number</th>
                <th className="px-4 py-3 text-left">Model Number</th>
                <th className="px-4 py-3 text-left">Item ID</th>
                <th className="px-4 py-3 text-left">Product Name</th>
                <th className="px-4 py-3 text-left">Quantity</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">QR Code</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-3">{item.slug}</td>
                  <td className="px-4 py-3">{item.EMIE_number}</td>
                  <td className="px-4 py-3">{item.Model_number}</td>
                  <td className="px-4 py-3">{item.item_id}</td>
                  <td className="px-4 py-3">{item.Product_name}</td>
                  <td className="px-4 py-3">{item.Quantity}</td>
                  <td className="px-4 py-3">{item.Price}</td>
                  <td className="px-4 py-3">{item.Category}</td>
                  <td className="px-4 py-3">{item.QR_Code}</td>
                  <td className="px-4 py-3">
                    <button className="text-blue-500 hover:text-blue-700 font-semibold mr-2">
                      Edit
                    </button>
                    <button className="text-red-500 hover:text-red-700 font-semibold">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
