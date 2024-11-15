import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// MongoDB URI - use environment variables in production
const uri = process.env.MONGODB_URI || "mongodb+srv://saheb:T4lIiTzp4VA2s2m6@cluster0.h3rk6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

export async function GET() {
    try {
        await client.connect();
        const database = client.db('stock');
        const inventory = database.collection('inventory');
        
        const allProducts = await inventory.find({}).toArray();
        
        // Wrap the response in a key
        return NextResponse.json({ products: allProducts }, { status: 200 });
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    } finally {
        await client.close();
    }
}


export async function POST(request) {
    try {
        const body = await request.json();

        await client.connect();
        const database = client.db('stock');
        const inventory = database.collection('inventory');
        
        const result = await inventory.insertOne(body);

        // Fetch the inserted document from the database
        const insertedProduct = await inventory.findOne({ _id: result.insertedId });

        return NextResponse.json({ product: insertedProduct, ok: true }, { status: 201 });
    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
    } finally {
        await client.close();
    }
}

