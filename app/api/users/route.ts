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
    const users = await User.find({ userId: (isAuth.user as any).userId }).select('-password');
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

        const user = new User({ ...data, userId: (isAuth.user as any).userId });
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