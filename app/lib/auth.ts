import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function isAuthenticated() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return { isAuth: false };

        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        return { isAuth: true, user: decoded };

    } catch (error) {
        return { isAuth: false };
    }
}

