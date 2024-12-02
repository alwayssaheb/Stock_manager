import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// MongoDB URI - use environment variables in production
const uri = "mongodb+srv://saheb:T4lIiTzp4VA2s2m6@cluster0.h3rk6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

export async function POST(request) {
    try {
      const { data } = await request.json(); // Expecting an array of objects
  
      if (!Array.isArray(data)) {
        return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
      }
  
      await client.connect();
      const database = client.db("stock");
      const inventory = database.collection("inventory");
  
      const result = await inventory.insertMany(data); // Insert multiple documents
  
      return NextResponse.json(
        { message: "Data uploaded successfully", insertedCount: result.insertedCount },
        { status: 201 }
      );
    } catch (error) {
      console.error("POST Error:", error);
      return NextResponse.json({ error: "Failed to add products", details: error.message }, { status: 500 });
    } finally {
      await client.close();
    }
  }
  