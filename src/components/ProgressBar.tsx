
interface ProgressBarProps {
  progress: number;
  className?: string;
}

export const ProgressBar = ({ progress, className = "" }: ProgressBarProps) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-sm text-slate-400 mb-1">
        <span>Course Progress</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
