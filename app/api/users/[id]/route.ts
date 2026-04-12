import db from "@/app/lib/dbConnect";
import User from "@/app/models/userModel";
import bcrypt from "bcrypt";

db().catch((error) => {
    console.error("❌ MongoDB Connection Error:", error);
});

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    await db();
    const { id } = await params;
    const user = await User.findById(id).select('-password');

    if (!user) {
        return Response.json({ error: 'User not found' }, { status: 404 });
    }
    return Response.json(user);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await db();
        const { id } = await params;
        const data = await request.json();
        const updateData: Record<string, any> = {
            name: data.name,
            email: data.email,
            status: data.status?.toLowerCase(),
        };
        if (data.password?.trim()) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).select('-password');

        if (!updatedUser) {
            return Response.json({ error: 'User not found' }, { status: 404 });
        }

        return Response.json(updatedUser);
    } catch (error: any) {
        console.error('Error updating user:', error);
        return Response.json(
            { error: error.message || 'Failed to update user' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    await db();
    const { id } = await params;
    const deletedUser = await User.findByIdAndDelete({ _id: id });

    if (!deletedUser) {
        return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({ message: `User deleted successfully` });
}