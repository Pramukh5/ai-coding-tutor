import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant that analyzes code and provides feedback.',
        },
        {
          role: 'user',
          content: `Analyze the following code and provide feedback:\n\n${code}`,
        },
      ],
      model: 'llama3-8b-8192',
    });

    return NextResponse.json({ analysis: chatCompletion.choices[0]?.message?.content || '' });
  } catch (error) {
    console.error('Error analyzing code with Groq:', error);
    return NextResponse.json({ error: 'Failed to analyze code' }, { status: 500 });
  }
}
