import { cn } from '../../utils/cn';

type TranscriptLine = {
  speaker: string;
  text: string;
  timestamp: Date;
  isAI?: boolean;
};

type TranscriptDisplayProps = {
  lines: TranscriptLine[];
  className?: string;
};

export function TranscriptDisplay({ lines, className }: TranscriptDisplayProps) {
  return (
    <div className={cn('bg-slate-700 rounded-lg p-4 h-96 overflow-y-auto', className)}>
      {lines.length === 0 ? (
        <div className="text-gray-400 text-center py-8">Waiting for conversation to start...</div>
      ) : (
        <div className="space-y-4">
          {lines.map((line, index) => (
            <div 
              key={index} 
              className={cn(
                'p-3 rounded-lg',
                line.isAI ? 'bg-blue-900/50 border-l-4 border-blue-500' : 'bg-slate-600 border-l-4 border-gray-500'
              )}
            >
              <div className="flex justify-between items-start">
                <span className={cn('font-semibold', line.isAI ? 'text-blue-300' : 'text-gray-300')}>
                  {line.speaker}
                </span>
                <span className="text-xs text-gray-400">
                  {line.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="mt-1 text-gray-100">{line.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}