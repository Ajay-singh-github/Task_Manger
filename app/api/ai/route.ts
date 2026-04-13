import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { title, about } = await req.json();

    // validation
    if (!title || !about) {
      return Response.json(
        { error: "Title and About are required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
      Task Title: ${title}
      Task Details: ${about}

      Write a short, clear and meaningful task description in one sentence.
    `;

    const result = await model.generateContent(prompt);

    const response = await result.response;
    const text = response.text();

    return Response.json({
      description: text,
    });

  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}