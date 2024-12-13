// components/StockTable.js
import { useRouter } from "next/navigation";

const StockTable = ({ products, deleteProduct }) => {
  const router = useRouter();

  return (
    <div className="overflow-x-auto w-full">
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
              <th
                key={header}
                className="px-4 py-3 text-left text-xs sm:text-sm whitespace-nowrap"
              >
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
                <td className="px-4 py-2 text-xs sm:text-sm">{item.model_id?.model_name || "N/A"}</td>
                <td className="px-4 py-2 text-xs sm:text-sm">{item.variant_type}</td>
                <td className="px-4 py-2 text-xs sm:text-sm">{item.qr_code}</td>
                <td className="px-4 py-2 text-xs sm:text-sm">{item.buy_price}</td>
                <td className="px-4 py-2 text-xs sm:text-sm">{item.sell_price}</td>
                <td className="px-4 py-2 text-xs sm:text-sm">{item.wholesale_price}</td>
                <td className="px-4 py-2 text-xs sm:text-sm">{item.quantity}</td>
                <td className="px-4 py-2 text-xs sm:text-sm">{item.hardware_category}</td>
                <td className="px-4 py-2 text-xs sm:text-sm">{item.shop_number?.shop_name || "N/A"}</td>
                <td className="px-4 py-2 text-xs sm:text-sm">{profit}</td>
                <td className="px-4 py-2 text-xs sm:text-sm flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={() => router.push(`/edit?id=${item._id}`)}
                    className="text-blue-500 hover:text-blue-700 text-xs sm:text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(item._id)}
                    className="text-red-500 hover:text-red-700 text-xs sm:text-sm"
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
