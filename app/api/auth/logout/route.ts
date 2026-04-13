import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    const response = NextResponse.json({ message: "Logged out successfully" });

    // ✅ Cookie remove karo
    response.cookies.set('token', '', {
        httpOnly: true,
        expires: new Date(0), // past date = delete
        path: '/',
    });

    return response;
}