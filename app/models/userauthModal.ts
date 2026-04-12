import mongoose, { Schema, Document, models, model } from "mongoose";

// 👉 TypeScript interface (optional but recommended)
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

// 👉 Schema
const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
        },
    },
    {
        timestamps: true, // createdAt & updatedAt auto
    }
);

// 👉 Model (important for Next.js hot reload issue fix)
const UserAuth = models.UserAuth || model<IUser>("UserAuth", userSchema);

export default UserAuth;