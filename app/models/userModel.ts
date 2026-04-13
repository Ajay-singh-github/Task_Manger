import mongoose, { Schema, Document, models, model } from "mongoose";

// 👉 TypeScript interface (optional but recommended)
export interface IUser extends Document {
    name: string;
    about: string;
    password: string;
    description: string;
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
        about: {
            type: String,
            required: [true, "About is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true, // createdAt & updatedAt auto
    }
);

// 👉 Model (important for Next.js hot reload issue fix)
const User = models.User || model<IUser>("User", userSchema);

export default User;