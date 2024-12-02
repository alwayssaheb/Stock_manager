import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    role: {
        type: String,
        required: [true, "Please provide a role"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    forgotPasswordToken: String, 
    forgotPasswordTokenExpiry: Date, // Corrected from `date` to `Date`
    VerifyToken: String,
    VerifyTokenExpiry: Date, // Corrected from `Date` to `Date`
});

// Check for existing models before creating a new one to prevent errors in development
const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
