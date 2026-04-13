import { isAuthenticated } from "@/app/lib/auth";
import db from "@/app/lib/dbConnect";
import Task from "@/app/models/taskModel";

export async function GET() {
    await db();
    const isAuth = await isAuthenticated();
    if (!isAuth.isAuth) {
        return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401 }
        );
    }
    const tasks = await Task.find({ userId: (isAuth.user as any).userId });
    return Response.json(tasks);
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