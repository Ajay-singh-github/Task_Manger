export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    return new Response(`Hello, User ${id}!`);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const data = await request.json();
    return new Response(`Updated User ${id} with data: ${JSON.stringify(data)}`);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    return new Response(`Deleted User ${id}`);
}