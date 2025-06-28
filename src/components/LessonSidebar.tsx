
import { useState } from 'react';
import { CheckCircle, Circle, Lock, Play, Book, Code2, Zap } from 'lucide-react';
import { AchievementBadge } from '@/components/AchievementBadge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LessonSidebarProps {
  isOpen: boolean;
  currentLesson: number;
  setCurrentLesson: (lesson: number) => void;
}

const lessons = [
  { id: 0, title: "Introduction to Variables", completed: true, locked: false, type: "concept" },
  { id: 1, title: "Working with Strings", completed: true, locked: false, type: "practice" },
  { id: 2, title: "Numbers and Math", completed: false, locked: false, type: "concept" },
  { id: 3, title: "Conditional Statements", completed: false, locked: false, type: "challenge" },
  { id: 4, title: "Loops and Iteration", completed: false, locked: true, type: "concept" },
  { id: 5, title: "Functions Basics", completed: false, locked: true, type: "practice" },
  { id: 6, title: "Arrays and Objects", completed: false, locked: true, type: "challenge" },
];

const achievements = [
  { id: 1, title: "First Steps", description: "Complete your first lesson", earned: true, icon: "🎯" },
  { id: 2, title: "Streak Master", description: "5 lessons in a row", earned: true, icon: "🔥" },
  { id: 3, title: "Code Warrior", description: "Complete 10 challenges", earned: false, icon: "⚔️" },
];

export const LessonSidebar = ({ isOpen, currentLesson, setCurrentLesson }: LessonSidebarProps) => {
  const [activeTab, setActiveTab] = useState<'lessons' | 'achievements'>('lessons');

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'concept': return <Book size={16} />;
      case 'practice': return <Code2 size={16} />;
      case 'challenge': return <Zap size={16} />;
      default: return <Circle size={16} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'concept': return 'text-blue-400';
      case 'practice': return 'text-green-400';
      case 'challenge': return 'text-orange-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <aside className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <div className="flex gap-1 p-1 bg-slate-700 rounded-lg">
          <button
            onClick={() => setActiveTab('lessons')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'lessons' 
                ? 'bg-slate-600 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Lessons
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'achievements' 
                ? 'bg-slate-600 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Achievements
          </button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {activeTab === 'lessons' ? (
          <div className="p-4 space-y-2">
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => !lesson.locked && setCurrentLesson(lesson.id)}
                disabled={lesson.locked}
                className={`w-full p-3 rounded-lg text-left transition-all duration-200 group ${
                  currentLesson === lesson.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : lesson.locked
                    ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {lesson.locked ? (
                      <Lock size={16} className="text-slate-500" />
                    ) : lesson.completed ? (
                      <CheckCircle size={16} className="text-green-400" />
                    ) : currentLesson === lesson.id ? (
                      <Play size={16} className="text-white" />
                    ) : (
                      <Circle size={16} className="text-slate-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={getTypeColor(lesson.type)}>
                        {getIcon(lesson.type)}
                      </span>
                      <span className="text-xs uppercase tracking-wide opacity-70">
                        {lesson.type}
                      </span>
                    </div>
                    <p className="font-medium truncate">{lesson.title}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {achievements.map((achievement) => (
              <AchievementBadge key={achievement.id} achievement={achievement} />
            ))}
          </div>
        )}
      </ScrollArea>
    </aside>
  );
};
