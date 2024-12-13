import mongoose from "mongoose";

const ShopSchema = new mongoose.Schema(
  {
    shop_name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Shop || mongoose.model("Shop", ShopSchema);
