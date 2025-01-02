import {connectDB } from "../../../dbConfig/dbConfig";
import Variant from "../../../model/variant";

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  try {
    const variant = await Variant.create(body);
    return new Response(JSON.stringify(variant), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}
