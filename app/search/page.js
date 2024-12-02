"use client"
import React, { useState, useEffect } from 'react'

const page = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    }

    const filteredRecords = products.filter((record) => {
        const searchTerm = search.toLowerCase();

        if (searchTerm === '') {
            return true;
        }

        return (
            record.slug.toLowerCase().includes(searchTerm) ||
            record.EMIE_number.toLowerCase().includes(searchTerm) ||
            record.Model_number.toLowerCase().includes(searchTerm) ||
            record.item_id.toLowerCase().includes(searchTerm) ||
            record.Product_name.toLowerCase().includes(searchTerm) ||
            record.Quantity.toString().toLowerCase().includes(searchTerm) ||
            record.Price.toString().toLowerCase().includes(searchTerm) ||
            record.Category.toLowerCase().includes(searchTerm) ||
            record.QR_Code.toLowerCase().includes(searchTerm)
        );
    });

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
        <div className="container mx-auto p-4">
            <div className="max-w-md mx-auto p-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full p-3 pl-10 pr-4 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={search}
                        onChange={handleSearchChange}
                    />
                    <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
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
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            {[
                                "Item Name",
                                "EMIE Number",
                                "Model Number",
                                "Item ID",
                                "Product Name",
                                "Quantity",
                                "Price",
                                "Category",
                                "QR Code",
                                "Actions",
                            ].map((header) => (
                                <th key={header} className="px-4 py-3 text-left text-xs sm:text-sm md:text-base lg:text-lg">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecords.map((item) => (
                            <tr key={item._id} className="border-b hover:bg-gray-100">
                                {[
                                    item.slug,
                                    item.EMIE_number,
                                    item.Model_number,
                                    item.item_id,
                                    item.Product_name,
                                    item.Quantity,
                                    item.Price,
                                    item.Category,
                                    item.QR_Code,
                                ].map((value, idx) => (
                                    <td key={idx} className="px-4 py-3 text-xs sm:text-sm md:text-base lg:text-lg">
                                        {value}
                                    </td>
                                ))}
                                <td className="px-4 py-3">
                                    <button className="text-blue-500 hover:text-blue-700 font-semibold mr-2 text-xs sm:text-sm md:text-base lg:text-lg">
                                        Edit
                                    </button>
                                    <button className="text-red-500 hover:text-red-700 font-semibold text-xs sm:text-sm md:text-base lg:text-lg">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default page
