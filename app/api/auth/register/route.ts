import db from "@/app/lib/dbConnect";
import UserAuth from "@/app/models/userauthModal";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    try {
        // 1. Connect DB
        await db();

        // 2. Get data from request
        const data = await request.json();

        const { name, email, password } = data;

        // 3. Validate required fields
        if (!name || !email || !password) {
            return new Response(
                JSON.stringify({ error: "All fields are required" }),
                { status: 400 }
            );
        }

        // 4. Check if user already exists
        const existingUser = await UserAuth.findOne({ email });

        if (existingUser) {
            return new Response(
                JSON.stringify({ error: "User already exists" }),
                { status: 400 }
            );
        }

        // 5. Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 6. Create user
        const newUser = new UserAuth({
            name,
            email,
            password: hashedPassword,
        });

        // 7. Save user
        const savedUser = await newUser.save();

        // 8. Remove password from response
        const userObj = savedUser.toObject();
        delete userObj.password;

        // 9. Return response
        return new Response(JSON.stringify(userObj), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("❌ Register Error:", error);

        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}