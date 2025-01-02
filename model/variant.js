import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  model_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Model", 
    required: true,
  },
  variant_type: {
    type: String,
    enum: ["Copy", "1st Copy", "Original"], 
    required: true,
  },
  qr_code: {
    type: String,
    required: true,
  },
  buy_price: {
    type: Number,
    required: true,
  },
  sell_price: {
    type: Number,
    required: true,
  },
  wholesale_price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  hardware_category: {
    type: String,
    required: true,
  },
  shop_number: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop", // Reference to the Shop model
  },
}, { timestamps: true });

export default mongoose.models.Variant || mongoose.model("Variant", variantSchema);
