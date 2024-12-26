import { connectDB } from "../../../../dbConfig/dbConfig";
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
    const { id } = params; 
    const updatedData = await req.json(); 
    
   
    console.log("Received data for update:", updatedData);
    
    await connectDB();
    
    try {
      
      if (updatedData.shop_name) {
        
        const variant = await Variant.findById(id).populate("shop_number");
        
        if (!variant) {
          return new Response(
            JSON.stringify({ error: "Variant not found" }),
            { status: 404 }
          );
        }
        
       
        const shop = variant.shop_number;
        if (shop) {
          shop.shop_name = updatedData.shop_name; 
          await shop.save(); 
          console.log("Updated Shop:", shop);
        } else {
          return new Response(JSON.stringify({ error: "Shop not found" }), {
            status: 404,
          });
        }
      }
  
     
      const updatedProduct = await Variant.findByIdAndUpdate(id, updatedData, {
        new: true, 
      });
      
      if (!updatedProduct) {
        return new Response(JSON.stringify({ error: "Product not found" }), {
          status: 404,
        });
      }
  
     
      const populatedProduct = await updatedProduct.populate("shop_number");
      
      return new Response(JSON.stringify({ product: populatedProduct }), {
        status: 200,
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
  }
