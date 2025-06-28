import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { lessonId, code } = await request.json();

    if (!lessonId || code === undefined) {
      return NextResponse.json({ error: 'Lesson ID and code are required' }, { status: 400 });
    }

    const { error } = await supabase.from('user_progress').upsert({
      user_id: user.id,
      lesson_id: lessonId,
      code,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Progress saved successfully' });
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
