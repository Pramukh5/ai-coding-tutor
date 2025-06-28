import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (code === undefined) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'Groq API key is not configured.' }, { status: 500 });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an AI coding tutor. Your role is to provide helpful hints to a student learning to code. The user will provide you with a code snippet, and you should respond with a concise, helpful hint to guide them. If the code is correct, praise them and suggest the next step. If it's incorrect, gently point out the error and suggest a fix without giving away the full solution. Keep your hints short and encouraging.`,
        },
        {
          role: 'user',
          content: code,
        },
      ],
      model: 'llama3-8b-8192',
    });

    const hint = completion.choices[0]?.message?.content || 'Sorry, I could not generate a hint at this time.';

    return NextResponse.json({ hint });
  } catch (error) {
    console.error('Error getting hint:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
