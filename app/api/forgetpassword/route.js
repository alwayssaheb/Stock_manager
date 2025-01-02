// pages/api/forgetpassword.js

import { connectDB } from "../../../dbConfig/dbConfig";
import User from "../../../model/user";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request) {
    
    try {
        const reqBody = await request.json();
        const { email, newPassword } = reqBody;

        // Validation check for missing fields
        if ( !newPassword) {
            return NextResponse.json(
                { error: "Email and new password are required" },
                { status: 400 }
            );
        }
        

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Hash the new password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        return NextResponse.json(
            { message: "Password updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating password:", error);
        return NextResponse.json(
            { error: "An error occurred while updating the password" },
            { status: 500 }
        );
    }
}
