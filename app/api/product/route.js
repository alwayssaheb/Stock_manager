// import { NextResponse } from 'next/server';
// import { MongoClient } from 'mongodb';

// const uri = process.env.MONGODB_URI || "mongodb+srv://saheb:T4lIiTzp4VA2s2m6@cluster0.h3rk6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const client = new MongoClient(uri);

import { connectDB } from "../../../dbConfig/dbConfig";
import Variant from "../../../model/variant";

export async function GET(req) {
  await connectDB();
  try {
    const variants = await Variant.find()// Populate the `shop_number` field with Shop details
      .populate("model_id")
      .populate("shop_number");
    return new Response(JSON.stringify({ products: variants }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

// export async function POST(request) {
//   try {
//     const body = await request.json();

//     await client.connect();
//     const database = client.db("stock");
//     const inventory = database.collection("inventory");

//     const result = await inventory.insertOne(body);

//     const insertedProduct = await inventory.findOne({ _id: result.insertedId });

//     return NextResponse.json(
//       { product: insertedProduct, ok: true },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("POST Error:", error);
//     return NextResponse.json(
//       { error: "Failed to add product" },
//       { status: 500 }
//     );
//   } finally {
//     await client.close();
//   }
// }


export async function DELETE(req) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id"); // Get the product ID from the query params

    if (!id) {
      return new Response(JSON.stringify({ error: "Product ID is required." }), { status: 400 });
    }

    // Find and delete the product by ID
    const deletedVariant = await Variant.findByIdAndDelete(id);

    if (!deletedVariant) {
      return new Response(JSON.stringify({ error: "Product not found." }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Product deleted successfully!" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
