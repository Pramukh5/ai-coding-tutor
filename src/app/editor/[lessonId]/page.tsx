import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import EditorClient from '@/components/EditorClient';

export default async function EditorPage({ params }: { params: { lessonId: string } }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login');
  }

  const { data: lesson } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', params.lessonId)
    .single();

  if (!lesson) {
    return redirect('/');
  }

  const { data: userProgress } = await supabase
    .from('user_progress')
    .select('code')
    .eq('user_id', user.id)
    .eq('lesson_id', lesson.id)
    .single();

  return <EditorClient lesson={lesson} userProgress={userProgress} />;
}
