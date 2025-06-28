import AuthButton from "@/components/AuthButton";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import CodeAnalyzer from "@/components/CodeAnalyzer";

interface Lesson {
  id: string;
  title: string;
  description: string;
  initial_code: string | null;
  created_at: string;
  completed?: boolean;
}

export default async function Index() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: lessonsData, error: lessonsError } = await supabase.from('lessons').select('*');

  let lessons: Lesson[] = lessonsData || [];

  if (user && lessons.length > 0) {
    const lessonIds = lessons.map(l => l.id);
    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .select('lesson_id, completed')
      .in('lesson_id', lessonIds)
      .eq('user_id', user.id);

    if (progressData) {
      const progressMap = new Map(progressData.map((p: { lesson_id: string, completed: boolean | null }) => [p.lesson_id, p.completed]));
      lessons = lessons.map(lesson => ({
        ...lesson,
        completed: !!progressMap.get(lesson.id),
      }));
    }
  }

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white min-h-screen">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-gray-800">
        <div className="w-full max-w-4xl flex justify-end items-center p-3 text-sm">
          <AuthButton />
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center flex-1 w-full px-4 md:px-20 text-center py-10">
        <header className="mb-10">
          <h1 className="text-5xl font-bold">
            Welcome to the AI Coding Tutor
          </h1>
        </header>

        {user ? (
          <>
            <CodeAnalyzer />
            {lessons && lessons.length > 0 ? (
              <div className="w-full max-w-6xl mt-10">
                <p className="mb-10 text-xl text-gray-400">
                  Select a lesson below, or jump right into the first one.
                </p>
                <Link href={`/editor/${lessons[0].id}`} className="mb-10 inline-block px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                  Go to First Lesson
                </Link>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lessons.map((lesson: Lesson) => {
                    const isCompleted = lesson.completed;
                    return (
                      <div key={lesson.id} className={`bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-left border-2 ${isCompleted ? 'border-green-500' : 'border-transparent'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-2xl font-bold">{lesson.title}</h3>
                          {isCompleted && (
                            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          )}
                        </div>
                        <p className="text-gray-400 mb-4 h-24 overflow-hidden">{lesson.description}</p>
                        <Link href={`/editor/${lesson.id}`} className={`w-full text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white ${isCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                          {isCompleted ? 'Review Lesson' : 'Start Lesson'}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-lg text-gray-400 mt-10">
                No lessons available yet. Please check back later.
                <br />
                Have you seeded your database? You can use the <code>supabase/seed.sql</code> file.
              </p>
            )}
          </>
        ) : (
          <p className="text-lg text-gray-400">Please log in to see the available lessons.</p>
        )}
      </div>
    </div>
  );
}
