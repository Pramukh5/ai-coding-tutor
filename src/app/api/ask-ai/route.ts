import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { pipeline } from '@xenova/transformers';
import Groq from 'groq-sdk';

export async function POST(request: Request) {
  const { question, editorContent } = await request.json();

  if (!question) {
    return NextResponse.json({ error: 'Question is required' }, { status: 400 });
  }

  const supabase = await createClient();
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  try {
    // 1. Generate an embedding for the user's question
    const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    const output = await embedder(question, { pooling: 'mean', normalize: true });
    const query_embedding = Array.from(output.data);

    // 2. Find relevant lesson sections in the database
    const { data: sections, error: matchError } = await supabase.rpc('match_lesson_sections', {
      query_embedding,
      match_threshold: 0.7,
      match_count: 5,
    });

    if (matchError) {
      throw new Error(`Failed to match sections: ${matchError.message}`);
    }

    const contextText = sections.map((s: any) => s.content).join('\n\n---\n\n');

    // 3. Generate a response using the Groq API
    const prompt = `You are a helpful AI coding tutor. A user is asking a question about a lesson and their current code.
Based on the following context from the lesson materials and the user's code from the editor, provide a clear and concise answer to the user's question.

Context from the lesson:
${contextText}

User's code from the editor:
${editorContent}

User's Question:
${question}

Answer:`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
    });

    const answer = chatCompletion.choices[0]?.message?.content || 'Sorry, I could not generate an answer.';

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Error in AI assistant:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}
