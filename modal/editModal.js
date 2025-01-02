import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useProduct } from "../hooks/useProduct";

const EditModal = ({ productId, closeModal }) => {
  const [product, setProduct] = useState(null);
  const { fetchProducts } = useProduct();
  const [formData, setFormData] = useState({
    model_name: "",
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/findbyid/${productId}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setProduct(data.product);

        setFormData({
          model_name: data.product?.model_id?.model_name || "",
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
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), 
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Product updated successfully!");
        fetchProducts(); 
        closeModal();
      } else {
       
        if (result.error && result.error.includes("E11000")) {
          setMessage("Error: The QR code already exists. Please enter a unique QR code.");
        } else {
          setMessage(`Error: ${result.error || "Failed to update product"}`);
        }
      }
    } catch (error) {
      setMessage("Error updating product");
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-8 relative overflow-hidden">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <IoClose size={24} />
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Edit Product
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label htmlFor="model_name" className="block text-sm font-medium text-gray-700">Model Name</label>
                <input
                  id="model_name"
                  name="model_name"
                  value={formData.model_name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Model Name"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label htmlFor="variant_type" className="block text-sm font-medium text-gray-700">Variant Type</label>
                <select
                  id="variant_type"
                  name="variant_type"
                  value={formData.variant_type}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                >
                  <option value="">Select Variant Type</option>
                  <option value="Copy">Copy</option>
                  <option value="1st Copy">1st Copy</option>
                  <option value="Original">Original</option>
                </select>
              </div>

              <div>
                <label htmlFor="qr_code" className="block text-sm font-medium text-gray-700">QR Code</label>
                <input
                  id="qr_code"
                  name="qr_code"
                  value={formData.qr_code}
                  onChange={handleChange}
                  type="text"
                  placeholder="QR Code"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label htmlFor="buy_price" className="block text-sm font-medium text-gray-700">Buy Price</label>
                <input
                  id="buy_price"
                  name="buy_price"
                  value={formData.buy_price}
                  onChange={handleChange}
                  type="number"
                  placeholder="Buy Price"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label htmlFor="sell_price" className="block text-sm font-medium text-gray-700">Sell Price</label>
                <input
                  id="sell_price"
                  name="sell_price"
                  value={formData.sell_price}
                  onChange={handleChange}
                  type="number"
                  placeholder="Sell Price"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label htmlFor="wholesale_price" className="block text-sm font-medium text-gray-700">Wholesale Price</label>
                <input
                  id="wholesale_price"
                  name="wholesale_price"
                  value={formData.wholesale_price}
                  onChange={handleChange}
                  type="number"
                  placeholder="Wholesale Price"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  type="number"
                  placeholder="Quantity"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label htmlFor="hardware_category" className="block text-sm font-medium text-gray-700">Hardware Category</label>
                <input
                  id="hardware_category"
                  name="hardware_category"
                  value={formData.hardware_category}
                  onChange={handleChange}
                  type="text"
                  placeholder="Hardware Category"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label htmlFor="shop_name" className="block text-sm font-medium text-gray-700">Shop Name</label>
                <input
                  id="shop_name"
                  name="shop_name"
                  value={formData.shop_name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Shop Name"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  type="text"
                  placeholder="Address"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>
          
          {/* Message */}
          {message && <p className="text-center text-sm text-red-500">{message}</p>}
          
          {/* Buttons */}
          <div className="flex justify-center space-x-4 mt-4">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Update Product
            </button>
            <button type="button" onClick={closeModal} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 focus:outline-none">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
