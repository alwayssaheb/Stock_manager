import {connectDB} from "../../../dbConfig/dbConfig"; // Ensure this path matches your project structure
import Variant from "../../../model/variant"; // Ensure this path matches your project structure
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectDB(); // Connect to the database using Mongoose

  try {
    // Extract QR Code from query parameters
    const { searchParams } = new URL(request.url);
    const qrCode = searchParams.get("QR_Code");

    console.log("Received QR Code:", qrCode);

    if (!qrCode) {
      return NextResponse.json(
        { error: "QR_Code is required" },
        { status: 400 }
      );
    }

    // Sanitize the QR Code
    const sanitizedQRCode = qrCode.trim();

    // Fetch the product using Mongoose
    const product = await Variant.findOne({ qr_code: sanitizedQRCode })
      .populate("model_id") // Populate related fields if required
      .populate("shop_number"); // Populate shop details if required

    if (!product) {
      return NextResponse.json(
        { error: "Product not found for the given QR Code." },
        { status: 404 }
      );
    }

    // console.log("this is the product in ulitmate scan route---------------------------", product);

    console.log("this is product.shop_number.shop_name---------", product.shop_number.shop_name);

    // Prepare the response with necessary fields
    const productDetails = {
        model_name: product.model_id.model_name,
      variant_type: product.variant_type,
      qr_code: product.qr_code,
      buy_price: product.buy_price,
      sell_price: product.sell_price,
      wholesale_price: product.wholesale_price,
      quantity: product.quantity,
      hardware_category: product.hardware_category,
      shop_name: product.shop_number.shop_name,
    };

    return NextResponse.json({ product: productDetails }, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
