import { connectDB } from "../../../dbConfig/dbConfig";
import User from "../../../model/user";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connectDB();

export async function POST(request) {
    try {

        const reqBody = await request.json();
        console.log(reqBody);
        const { name, email, password, role, branch } = reqBody; // Include branch here
        console.log("This is username: " + name);

        if (!name || !email || !password || !role || !branch) { // Validate branch field
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });
        if (user) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            username: name,
            email,
            password: hashedPassword,
            role,
            branch, // Add branch to the newUser object
        });

        const savedUser = await newUser.save();
        console.log(savedUser);

        return NextResponse.json(
            { message: "User registered successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error during user registration:", error);
        return NextResponse.json(
            { error: "An error occurred during registration" },
            { status: 500 }
        );
    }
}
