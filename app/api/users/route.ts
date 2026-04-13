import { isAuthenticated } from "@/app/lib/auth";
import db from "@/app/lib/dbConnect";
import User from "@/app/models/userModel";
import bcrypt from "bcrypt";

export async function GET() {
    await db();
    const isAuth = await isAuthenticated();
    if (!isAuth.isAuth) {
        return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401 }
        );
    }
    const users = await User.find().select('-password');
    return Response.json(users);
}

export async function POST(request: Request) {
    try {
        await db();
        const isAuth = await isAuthenticated();
        if (!isAuth.isAuth) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401 }
            );
        }
        const data = await request.json();
        // Normalize status to lowercase
        const normalizedData = {
            ...data,
        };
        // Hash password if provided
        if (normalizedData.password) {
            const saltRounds = 10;
            normalizedData.password = await bcrypt.hash(normalizedData.password, saltRounds);
        }

        const user = new User(normalizedData);
        const savedUser = await user.save();
        const savedUserObj = savedUser.toObject();
        delete savedUserObj.password;

        return Response.json({
            message: "User created successfully",
            user: savedUserObj,
        });
    } catch (error: any) {
        return Response.json(
            { error: error.message || "Failed to create user" },
            { status: 500 }
        );
    }
}