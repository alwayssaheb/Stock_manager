import {connectDB }from "../../../dbConfig/dbConfig";
import Model from "../../../model/Models";

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  try {
    const model = await Model.create(body);
    return new Response(JSON.stringify(model), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}
