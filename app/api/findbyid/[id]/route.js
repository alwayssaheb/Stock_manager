import {connectDB} from "../../../../dbConfig/dbConfig";
import Variant from "../../../../model/variant";

export async function GET(req, { params }) {
    const { id } = params; // Get product ID from params
    await connectDB();
    try {
      const product = await Variant.findById(id)
        .populate("model_id")
        .populate("shop_number");

        console.log("&&&&&&&&&&&&&&", product);
      if (!product) {
        return new Response(JSON.stringify({ error: "Product not found" }), {
          status: 404,
        });
      }
      return new Response(JSON.stringify({ product }), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
  }

  export async function PUT(req, { params }) {
    const { id } = params; // Get the product ID from the route parameter
    const updatedData = await req.json(); // Parse the request body
  
    await connectDB();
  
    try {
      // Update the product in the database
      const updatedProduct = await Variant.findByIdAndUpdate(id, updatedData, {
        new: true, // Return the updated document
      });
  
      if (!updatedProduct) {
        return new Response(JSON.stringify({ error: "Product not found" }), {
          status: 404,
        });
      }
  
      return new Response(JSON.stringify({ product: updatedProduct }), {
        status: 200,
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
  }
  
