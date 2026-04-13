import { isAuthenticated } from "@/app/lib/auth";
import db from "@/app/lib/dbConnect";
import Task from "@/app/models/taskModel";

db().catch((error) => {
    console.error("❌ MongoDB Connection Error:", error);
});

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    await db();
    const isAuth = await isAuthenticated();
    if (!isAuth.isAuth) {
        return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401 }
        );
    }
    const { id } = await params;
    const task = await Task.findById(id);

    if (!task) {
        return Response.json({ error: 'Task not found' }, { status: 404 });
    }
    return Response.json(task);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await db();
        const isAuth = await isAuthenticated();
        if (!isAuth.isAuth) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401 }
            );
        }
        const { id } = await params;
        const data = await request.json();
        const updateData: Record<string, any> = {
            title: data.title,
            about: data.about,
            description: data.description,
            status: data.status,
            priority: data.priority,
        };
        const updatedTask = await Task.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedTask) {
            return Response.json({ error: 'Task not found' }, { status: 404 });
        }

        return Response.json(updatedTask);
    } catch (error: any) {
        console.error('Error updating task:', error);
        return Response.json(
            { error: error.message || 'Failed to update task' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    await db();
    const isAuth = await isAuthenticated();
    if (!isAuth.isAuth) {
        return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401 }
        );
    }
    const { id } = await params;

    const deletedTask = await Task.findByIdAndDelete({ _id: id });

    if (!deletedTask) {
        return Response.json({ error: 'Task not found' }, { status: 404 });
    }

    return Response.json({ message: `Task deleted successfully` });
}