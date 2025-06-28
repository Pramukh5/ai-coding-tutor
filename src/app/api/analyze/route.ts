import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Helper function to detect language
async function detectLanguage(code: string): Promise<string> {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a language detection expert. Analyze the code snippet and respond with only the name of the programming language (e.g., Python, JavaScript, TypeScript).',
        },
        {
          role: 'user',
          content: `Detect the language of this code:\n\n\`\`\`\n${code}\n\`\`\``,
        },
      ],
      model: 'llama3-8b-8192',
      temperature: 0,
    });
    return response.choices[0]?.message?.content?.trim() || 'unknown';
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'unknown'; // Fallback
  }
}

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  if (!code) {
    return NextResponse.json({ error: 'Code is required' }, { status: 400 });
  }

  try {
    const language = await detectLanguage(code);

    if (language === 'unknown') {
        return NextResponse.json({ error: 'Could not detect language' }, { status: 400 });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a helpful AI assistant that analyzes ${language} code and provides feedback, suggestions, and explanations.`,
        },
        {
          role: 'user',
          content: `Please analyze the following ${language} code and provide feedback on its quality, potential bugs, and suggestions for improvement. Explain any complex parts of the code. Here is the code:\n\n\`\`\`${language}\n${code}\n\`\`\``,
        },
      ],
      model: 'llama3-8b-8192',
    });

    const analysis = chatCompletion.choices[0]?.message?.content || 'No analysis available.';

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Groq API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze code using Groq API' },
      { status: 500 }
    );
  }
}
