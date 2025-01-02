"use client";
import React, { useState, useEffect } from "react";
import StockTable from "../../component/StockTable"; 

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  // Search handler
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  // Filter products based on the search term
  const filteredRecords = products.filter((record) => {
    const searchTerm = search.toLowerCase();

    if (searchTerm === "") return true;

    return (
      record.model_id?.model_name?.toLowerCase().includes(searchTerm) ||
      record.variant_type?.toLowerCase().includes(searchTerm) ||
      record.qr_code?.toLowerCase().includes(searchTerm) ||
      record.buy_price?.toString().includes(searchTerm) ||
      record.sell_price?.toString().includes(searchTerm) ||
      record.wholesale_price?.toString().includes(searchTerm) ||
      record.quantity?.toString().includes(searchTerm) ||
      record.hardware_category?.toLowerCase().includes(searchTerm) ||
      record.shop_number?.shop_name?.toLowerCase().includes(searchTerm) ||
      (record.sell_price - record.buy_price).toString().includes(searchTerm) // Search profit
    );
  });

  // Fetch products from API
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
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };

    fetchProduct();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        {/* Search Bar Section */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-4 pl-12 pr-4 border-2 border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={search}
            onChange={handleSearchChange}
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 4a7 7 0 0113 7 7 7 0 01-7 7 7 7 0 01-6-3.38M18 15l3 3-3 3"
            />
          </svg>
        </div>

        {/* Pass filteredRecords */}
        <StockTable products={filteredRecords} deleteProduct={() => {}} />
      </div>
    </div>
  );
};

export default SearchPage;
