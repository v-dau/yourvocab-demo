import React from 'react';
import { Button } from '@/components/ui/button';
import { useDisplayMode } from '@/stores/displayModeStore';
import { Maximize2, Minimize2, RotateCcw } from 'lucide-react';

interface DisplayModeToolbarProps {
  className?: string;
  onResetAllCards?: () => void;
}

export const DisplayModeToolbar: React.FC<DisplayModeToolbarProps> = ({
  className = '',
  onResetAllCards,
}) => {
  const { globalDisplayMode, setGlobalDisplayMode } = useDisplayMode();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant={globalDisplayMode === 'basic' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setGlobalDisplayMode('basic')}
        className="gap-2"
      >
        <Minimize2 className="h-4 w-4" />
        <span className="hidden sm:inline text-xs">Basic</span>
      </Button>

      <Button
        variant={globalDisplayMode === 'full' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setGlobalDisplayMode('full')}
        className="gap-2"
      >
        <Maximize2 className="h-4 w-4" />
        <span className="hidden sm:inline text-xs">Full</span>
      </Button>

      {/* Reset/Sync Button */}
      {onResetAllCards && (
        <Button variant="ghost" size="sm" onClick={onResetAllCards} className="gap-2 ml-2">
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">Reset</span>
        </Button>
      )}
    </div>
  );
};
