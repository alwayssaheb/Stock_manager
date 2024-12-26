import { useEffect, useState } from "react";

export const useProduct = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [productForm, setProductForm] = useState({
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

  // Fetch products
  const fetchProducts = async () => {
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

  // Add a product
  const addProduct = async () => {
    // event.preventDefault(); 
    try {
      const response = await fetch("/api/productbulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: [productForm] }),
      });

      const data = await response.json();

      if (data.message === "Data successfully saved to the database!") {
        fetchProducts(); 
        setMessage("Product added successfully!");
        setProductForm({}); 
      } else {
        setMessage(data.error || "Failed to add product.");
      }
    } catch (error) {
      console.error("Add product error:", error);
      setMessage(data.error || "Failed to add product.");
    }
  };

  // Handle form changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  // Delete a product
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`/api/product?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Product deleted successfully!");
        fetchProducts(); 
      } else {
        setMessage(`Failed to delete product: ${data.error}`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setMessage(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    message,
    setMessage,
    productForm,
    setProductForm,
    handleChange,
    fetchProducts,
    addProduct,
    deleteProduct,
  };
};
