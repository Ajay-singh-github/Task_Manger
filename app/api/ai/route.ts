import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title, about } = await req.json();

    // validation
    if (!title || !about) {
      return NextResponse.json(
        { error: "Title and About are required" },
        { status: 400 }
      );
    }

    const prompt = `
      Task Title: ${title}
      Task Details: ${about}

      Write a short, clear and meaningful task description in one sentence.
    `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // best free model
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return NextResponse.json(
        { error: "Groq API Error" },
        { status: 500 }
      );
    }

    const text = data.choices?.[0]?.message?.content;

    return NextResponse.json({
      description: text,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}