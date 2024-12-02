import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import * as XLSX from "xlsx";
import formidable from "formidable";
import fs from "fs/promises";

const uri = "mongodb+srv://saheb:T4lIiTzp4VA2s2m6@cluster0.h3rk6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

// Configuring formidable for file uploads
export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parser
  },
};

export async function POST(req) {
  try {
    // Parse the file using formidable
    const form = new formidable.IncomingForm({
      keepExtensions: true,
      multiples: false, // Single file upload
    });

    const { files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    console.log('Parsed Files:', files); // Log the received files

    const filePath = files.file?.filepath;
    
    if (!filePath) {
      console.error("File not uploaded or filepath missing.");
      return NextResponse.json({ error: "File not uploaded." }, { status: 400 });
    }

    // Read and parse the Excel file
    const fileBuffer = await fs.readFile(filePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log("Parsed Data from Excel:", data); // Log the data

    if (!data || data.length === 0) {
      throw new Error("Excel file is empty or has invalid format");
    }

    // Connect to MongoDB and insert data
    await client.connect();
    const database = client.db("stock");
    const inventory = database.collection("inventory");
    const result = await inventory.insertMany(data);

    return NextResponse.json(
      { message: "Data uploaded successfully", insertedCount: result.insertedCount },
      { status: 201 }
    );
  } catch (error) {
    console.error("File upload error:", error.message);
    return NextResponse.json({ error: "Failed to upload file", details: error.message }, { status: 500 });
  } finally {
    await client.close();
  }
}
