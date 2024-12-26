import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaTrash, FaEdit } from "react-icons/fa";

import EditModal from '../modal/editModal'; 

const StockTable = ({ products, deleteProduct, fetchProducts }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productIdToEdit, setProductIdToEdit] = useState(null);

  // Calculate paginated data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const openModal = (id) => {
    fetchProducts();
    setProductIdToEdit(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    fetchProducts();
    setIsModalOpen(false);
    setProductIdToEdit(null);
  };

  const handleDeleteProduct = async (id) => {
    // Save the current page before deleting
    const previousPage = currentPage;

    // Delete the product
    await deleteProduct(id);

    // Fetch the products after deletion
    await fetchProducts();

   
    if (currentItems.length === 1 && currentPage > 1) {
      setCurrentPage(previousPage - 1); 
    } else {
      setCurrentPage(previousPage); 
    }
  };

  return (
    <div className="relative w-full">
      {/* Table Container */}
      <div className="overflow-x-auto w-full">
        <table className="w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-blue-500 text-white">
            <tr>
              {[
                "Model Name",
                "Variant Type",
                "QR Code",
                "Buy Price",
                "Sell Price",
                "Wholesale Price",
                "Quantity",
                "Hardware Category",
                "Shop Number",
                "Profit",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-4 py-3 text-left text-xs sm:text-sm font-semibold whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => {
              const profit = item.sell_price - item.buy_price;
              return (
                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-100 transition duration-200"
                >
                  <td className="px-4 py-2 text-xs sm:text-sm">
                    {item.model_id?.model_name || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-xs sm:text-sm">
                    {item.variant_type}
                  </td>
                  <td className="px-4 py-2 text-xs sm:text-sm">
                    {item.qr_code}
                  </td>
                  <td className="px-4 py-2 text-xs sm:text-sm">
                    {item.buy_price}
                  </td>
                  <td className="px-4 py-2 text-xs sm:text-sm">
                    {item.sell_price}
                  </td>
                  <td className="px-4 py-2 text-xs sm:text-sm">
                    {item.wholesale_price}
                  </td>
                  <td className="px-4 py-2 text-xs sm:text-sm">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-2 text-xs sm:text-sm">
                    {item.hardware_category}
                  </td>
                  <td className="px-4 py-2 text-xs sm:text-sm">
                    {item.shop_number?.shop_name || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-xs sm:text-sm">{profit}</td>
                  <td className="px-4 py-2 text-xs sm:text-sm flex flex-wrap gap-2">
                    <button
                      onClick={() => openModal(item._id)} // it Open the modal on pen click
                      className="text-blue-500 hover:text-blue-700 text-xs sm:text-sm font-medium transition duration-200"
                      aria-label={`Edit ${item.model_id?.model_name || "item"}`}
                    >
                      <FaEdit className="text-lg" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(item._id)} 
                      className="text-red-500 hover:text-red-700 text-xs sm:text-sm font-medium transition duration-200"
                      aria-label={`Delete ${
                        item.model_id?.model_name || "item"
                      }`}
                    >
                      <FaTrash className="text-lg" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="sticky bottom-0 bg-white shadow-md p-4 flex justify-center gap-4 items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-md ${
            currentPage === 1
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Previous
        </button>
        <span className="text-xs sm:text-base">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-md ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>

      {/* Edit Product Modal */}
      {isModalOpen && <EditModal productId={productIdToEdit} closeModal={closeModal} />}
    </div>
  );
};

export default StockTable;
