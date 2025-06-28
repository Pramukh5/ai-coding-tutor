
interface Achievement {
  id: number;
  title: string;
  description: string;
  earned: boolean;
  icon: string;
}

interface AchievementBadgeProps {
  achievement: Achievement;
}

export const AchievementBadge = ({ achievement }: AchievementBadgeProps) => {
  return (
    <div className={`p-3 rounded-lg border transition-all duration-200 ${
      achievement.earned
        ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30 shadow-lg'
        : 'bg-slate-700/50 border-slate-600 opacity-60'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`text-2xl ${achievement.earned ? '' : 'grayscale'}`}>
          {achievement.icon}
        </div>
        <div className="flex-1">
          <h4 className={`font-medium ${achievement.earned ? 'text-amber-400' : 'text-slate-400'}`}>
            {achievement.title}
          </h4>
          <p className="text-sm text-slate-500">{achievement.description}</p>
        </div>
        {achievement.earned && (
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
        )}
      </div>
    </div>
  );
};
