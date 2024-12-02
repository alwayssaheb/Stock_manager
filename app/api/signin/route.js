import { connectDB } from "../../../dbConfig/dbConfig";
import User from "../../../model/user";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// Connect to the database
connectDB();

export async function POST(request) {
    try {
        // Parse the request body
        const reqBody = await request.json();
        console.log(reqBody);
        const { email, password } = reqBody;

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Check if the password matches
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.AUTH_SECRET, // Ensure you have this variable in your .env file
            { expiresIn: "1d" } // Token expiration time
        );

        // Send a success response with the token
        return NextResponse.json(
            {
                message: "Login successful",
                token, // Return the token to the client
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                    username: user.username,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error during user login:", error);
        return NextResponse.json(
            { error: "An error occurred during login" },
            { status: 500 }
        );
    }
}
