// components/StockTable.js
import { useRouter } from "next/navigation";

const StockTable = ({ products, deleteProduct }) => {
  const router = useRouter();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
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
              <th key={header} className="px-4 py-3 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((item) => {
            const profit = item.sell_price - item.buy_price; // Calculate profit
            return (
              <tr key={item._id} className="border-b hover:bg-gray-100">
                <td>{item.model_id?.model_name || "N/A"}</td>
                <td>{item.variant_type}</td>
                <td>{item.qr_code}</td>
                <td>{item.buy_price}</td>
                <td>{item.sell_price}</td>
                <td>{item.wholesale_price}</td>
                <td>{item.quantity}</td>
                <td>{item.hardware_category}</td>
                <td>{item.shop_number?.shop_name || "N/A"}</td>
                <td>{profit}</td>
                <td>
                  <button
                    onClick={() => router.push(`/edit?id=${item._id}`)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(item._id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
