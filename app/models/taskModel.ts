import mongoose, { Schema, Document, models, model } from "mongoose";

// 👉 TypeScript interface (optional but recommended)
export interface ITask extends Document {
    title: string;
    about: string;
    description: string;
    status: string;
    priority: string;
    userId: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

// 👉 Schema
const taskSchema = new Schema<ITask>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        about: {
            type: String,
            required: [true, "About is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        status: {
            type: String,
            enum: ["pending", "in-progress", "completed"],
            default: "pending",
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserAuth",
            required: true,
        },
    },
    {
        timestamps: true, // createdAt & updatedAt auto
    }
);

// 👉 Model (important for Next.js hot reload issue fix)
const Task = models.Task || model<ITask>("Task", taskSchema);

export default Task;