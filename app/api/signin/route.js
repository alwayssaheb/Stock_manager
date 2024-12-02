import { connectDB } from "../../../dbConfig/dbConfig";
import User from "../../../model/user";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";


connectDB();

export async function POST(request) {
    try {

        const reqBody = await request.json();
        console.log(reqBody);
        const { email, password } = reqBody;


        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }


        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }


        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }


        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.AUTH_SECRET, 
            { expiresIn: "1d" }
        );

     
        return NextResponse.json(
            {
                message: "Login successful",
                token, 
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
