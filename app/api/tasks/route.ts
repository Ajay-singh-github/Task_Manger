import { isAuthenticated } from "@/app/lib/auth";
import db from "@/app/lib/dbConnect";
import Task from "@/app/models/taskModel";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    await db();
    const isAuth = await isAuthenticated();
    if (!isAuth.isAuth) {
        return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401 }
        );
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    try {
        const totalTasks = await Task.countDocuments({ userId: (isAuth.user as any).userId });
        const tasks = await Task.find({ userId: (isAuth.user as any).userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalTasks / limit);

        return Response.json({
            tasks,
            pagination: {
                currentPage: page,
                totalPages,
                totalTasks,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                limit
            }
        });
    } catch (error: any) {
        return Response.json(
            { error: error.message || "Failed to fetch tasks" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
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

        const task = new Task({ ...data, userId: (isAuth.user as any).userId });
        const savedTask = await task.save();

        return Response.json({
            message: "Task created successfully",
            task: savedTask,
        });
    } catch (error: any) {
        return Response.json(
            { error: error.message || "Failed to create task" },
            { status: 500 }
        );
    }
}