import dbConnect from "@/app/lib/dbConnect";

dbConnect().catch((error) => {
    console.error("❌ MongoDB Connection Error:", error);
});


export async function GET() {
    
    return new Response("Hello, World!");
}

export async function POST(request: Request) {
    const data = await request.json();
    return new Response(`Received data: ${JSON.stringify(data)}`);
}