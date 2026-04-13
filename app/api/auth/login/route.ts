import db from "@/app/lib/dbConnect";
import UserAuth from "@/app/models/userauthModal";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await db();

        const { email, password } = await request.json();

        // 1. Validate
        if (!email || !password) {
            return new Response(
                JSON.stringify({ error: "Email and password are required" }),
                { status: 400 }
            );
        }

        // 2. Find user
        const user = await UserAuth.findOne({ email });

        if (!user) {
            return new Response(
                JSON.stringify({ error: "User not found" }),
                { status: 404 }
            );
        }

        // 3. Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return new Response(
                JSON.stringify({ error: "Invalid password" }),
                { status: 401 }
            );
        }

        // 4. Create JWT Token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        // 5. Set Cookie
        const cookieStore = await cookies();
        cookieStore.set("token", token, {
            httpOnly: true,       // JS access nahi kar sakta
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 1, // 1 day
            path: "/",
        });

        // 6. Clean user object
        const userObj = user.toObject();
        delete userObj.password;

        // 7. Response
        return new Response(
            JSON.stringify({
                message: "Login successful",
                user: userObj,
            }),
            { status: 200 }
        );

    } catch (error) {
        console.error("❌ Login Error:", error);

        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}