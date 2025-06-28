
import { useState } from 'react';
import { CodeEditor } from '@/components/CodeEditor';
import { LessonSidebar } from '@/components/LessonSidebar';
import { TutorialHeader } from '@/components/TutorialHeader';

const Index = () => {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <TutorialHeader 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <LessonSidebar 
          isOpen={sidebarOpen}
          currentLesson={currentLesson}
          setCurrentLesson={setCurrentLesson}
        />
        
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-0' : 'ml-0'}`}>
          <CodeEditor currentLesson={currentLesson} />
        </main>
      </div>
    </div>
  );
};

export default Index;
