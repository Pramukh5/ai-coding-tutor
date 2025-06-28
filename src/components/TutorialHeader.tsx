
import { Menu, X, Code, Trophy, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ProgressBar';

interface TutorialHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const TutorialHeader = ({ sidebarOpen, setSidebarOpen }: TutorialHeaderProps) => {
  return (
    <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-slate-300 hover:text-white hover:bg-slate-700"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
        
        <div className="flex items-center gap-2">
          <Code className="text-blue-400" size={24} />
          <h1 className="text-xl font-bold text-white">CodeTutor</h1>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-8">
        <ProgressBar progress={45} />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-amber-400">
          <Trophy size={18} />
          <span className="font-medium">1,250 XP</span>
        </div>
        
        <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-700">
          <User size={18} />
        </Button>
      </div>
    </header>
  );
};
