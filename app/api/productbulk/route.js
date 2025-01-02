import { NextResponse } from "next/server";
import { connectDB } from "../../../dbConfig/dbConfig";
import Model from "../../../model/Models";
import Variant from "../../../model/variant";
import Shop from "../../../model/shop";

export async function POST(req) {
  await connectDB();

  const { data } = await req.json();
  if (!data || !Array.isArray(data)) {
    return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
  }

  try {
    for (const entry of data) {
      const {
        model_name,
        variant_type,
        qr_code,
        buy_price,
        sell_price,
        wholesale_price,
        quantity,
        hardware_category,
        shop_name, // Assuming shop name is provided
        address,   // Address for the shop, optional
      } = entry;

      // Validate required fields
      if (!model_name || !variant_type || !qr_code || !buy_price || !sell_price || !wholesale_price || !quantity || !hardware_category || !shop_name) {
        const missingFields = [];
        if (!model_name) missingFields.push('model_name');
        if (!variant_type) missingFields.push('variant_type');
        if (!qr_code) missingFields.push('qr_code');
        if (!buy_price) missingFields.push('buy_price');
        if (!sell_price) missingFields.push('sell_price');
        if (!wholesale_price) missingFields.push('wholesale_price');
        if (!quantity) missingFields.push('quantity');
        if (!hardware_category) missingFields.push('hardware_category');
        if (!shop_name) missingFields.push('shop_name');
        return NextResponse.json({ error: `Missing required fields: ${missingFields.join(', ')}` }, { status: 400 });
     }
     

      // Look for an existing model with the same model_name and category
      let model = await Model.findOne({ model_name });

      // Create the model if it doesn't exist
      if (!model) {
        model = await Model.create({ model_name });
      }

      // Look for an existing shop with the same shop_name and address (if provided)
      let shop = await Shop.findOne({ shop_name, ...(address && { address }) });

      // Create the shop if it doesn't exist
      if (!shop) {
        shop = await Shop.create({ shop_name, address });
      }

      // Create the variant entry linked to the model and shop
      await Variant.create({
        model_id: model._id,
        variant_type,
        qr_code,
        buy_price,
        sell_price,
        wholesale_price,
        quantity,
        hardware_category,
        shop_number: shop._id, // Correctly referencing the shop's _id
      });
    }

    return NextResponse.json({ message: "Data successfully saved to the database!" }, { status: 200 });
  } catch (error) {
    console.error("Error saving to database:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]; 
      const value = error.keyValue[field];         
      return NextResponse.json(
          { error: `Duplicate key error: ${field} '${value}' already exists.` },
          { status: 400 }
      );
  }
    return NextResponse.json({ error: "An error occurred while saving data." }, { status: 500 });
  }
}
