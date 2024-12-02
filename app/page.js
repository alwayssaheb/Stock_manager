"use client";
import Image from "next/image";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import { useRouter } from "next/navigation";

export default function Home() {
  const { authUser, isLoggedIn,role  } = useAuth(); // Access auth state
  console.log("This is user details:", authUser);
  console.log("This is Auth Role",role);
  const router = useRouter();
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
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };

    fetchProduct();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();

    if (
      !ProductForm.slug ||
      !ProductForm.Product_name ||
      !ProductForm.Quantity ||
      !ProductForm.Price
    ) {
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
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
        {/* Search Product Section */}
       <button className="bg-blue-500 rounded w-full h-10"  onClick={() => router.push("/search")}>
        Search 
       </button>

        {/* Add Product Section */}
        <div className="mb-8">
          <h1 className=" text-lg sm:text-2xl font-semibold text-gray-800 mb-4 mt-4 ">
            Add a Product
          </h1>
          <form
            onSubmit={addProduct}
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              { name: "slug", placeholder: "Item Name" },
              { name: "EMIE_number", placeholder: "EMIE Number" },
              { name: "Model_number", placeholder: "Model Number" },
              { name: "item_id", placeholder: "Item ID (backend use)" },
              { name: "Product_name", placeholder: "Product Name" },
              {
                name: "Quantity",
                placeholder: "Quantity (in stock)",
                type: "number",
              },
              { name: "Price", placeholder: "Price (per unit)" },
              {
                name: "Category",
                placeholder: "Category (e.g., electronics, hardware)",
              },
              { name: "QR_Code", placeholder: "QR Code" },
            ].map((field) => (
              <input
                key={field.name}
                name={field.name}
                value={ProductForm[field.name]}
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
          {authUser?.role === "Admin" && ( // Use authUser.role to check role
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
                  <th key={header} className="px-4 py-3 text-left">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
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
                    <td key={idx} className="px-4 py-3">
                      {value}
                    </td>
                  ))}
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
