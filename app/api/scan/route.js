import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb'; // Import the clientPromise

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const qrCode = searchParams.get("QR_Code");
    console.log("This is qrcode------------------:", qrCode);

    if (!qrCode) {
        return NextResponse.json({ error: "QR_Code is required" }, { status: 400 });
    }

    try {
        const client = await clientPromise; // Wait for the clientPromise to resolve
        const database = client.db('stock');
        const inventory = database.collection('inventory');
        
        // Sanitize the QR code input
        const sanitizedQRCode = qrCode.trim();
        const product = await inventory.findOne({ QR_Code: sanitizedQRCode });
        console.log("Product found:", product);

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ product }, { status: 200 });
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
    }
}
