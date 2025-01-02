import { NextResponse } from 'next/server';
import { connectDB } from '../../../dbConfig/dbConfig'; // Adjust the path as per your project structure
import Shop from '../../../model/shop'; // Adjust the path to your Shop model

export async function POST(req) {
  await connectDB(); // Connect to the database

  try {
    const { shop_name, address } = await req.json(); // Parse JSON request body
    // Validate required fields
    if (!shop_name) {
      return NextResponse.json(
        { error: 'shop_name are required.' },
        { status: 400 }
      );
    }

    // Create a new shop document
    const newShop = await Shop.create({
      shop_name,
      address   
    });

    return NextResponse.json(
      { message: 'Shop created successfully!', shop: newShop },
      { status: 201 }
    );
  } catch (error) {
    if (error.code === 11000) {
      // Handle unique constraint violation
      return NextResponse.json(
        { error: 'Shop number must be unique.' },
        { status: 409 }
      );
    }

    console.error('Error creating shop:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the shop.' },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json(
    { message: 'Only POST requests are supported on this route.' },
    { status: 405 }
  );
}
