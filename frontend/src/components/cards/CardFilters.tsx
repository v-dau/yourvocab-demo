import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import type { CardLevel, CardPopularity } from '@/types/card';

interface CardFiltersProps {
  onFilterChange: (filters: CardFiltersState) => void;
}

export interface CardFiltersState {
  levels: CardLevel[];
  popularity: CardPopularity[];
  partOfSpeech: string[];
  hasExample: boolean | null;
}

const LEVELS: CardLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const POPULARITY_LEVELS: CardPopularity[] = [1, 2, 3, 4, 5];
const PARTS_OF_SPEECH = ['Noun', 'Verb', 'Adjective', 'Adverb', 'Pronoun', 'Preposition'];

// Map popularity levels to their labels
const POPULARITY_LABELS: Record<CardPopularity, string> = {
  0: 'N/A',
  1: 'Extremely rare',
  2: 'Rare',
  3: 'Uncommon',
  4: 'Common',
  5: 'Essentials',
};

export const CardFilters: React.FC<CardFiltersProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<CardFiltersState>({
    levels: [],
    popularity: [],
    partOfSpeech: [],
    hasExample: null,
  });

  const handleFilterChange = (newFilters: CardFiltersState) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleLevel = (level: CardLevel) => {
    const updatedLevels = filters.levels.includes(level)
      ? filters.levels.filter((l) => l !== level)
      : [...filters.levels, level];
    handleFilterChange({ ...filters, levels: updatedLevels });
  };

  const togglePopularity = (pop: CardPopularity) => {
    const updatedPopularity = filters.popularity.includes(pop)
      ? filters.popularity.filter((p) => p !== pop)
      : [...filters.popularity, pop];
    handleFilterChange({ ...filters, popularity: updatedPopularity });
  };

  const togglePartOfSpeech = (pos: string) => {
    const updatedPOS = filters.partOfSpeech.includes(pos)
      ? filters.partOfSpeech.filter((p) => p !== pos)
      : [...filters.partOfSpeech, pos];
    handleFilterChange({ ...filters, partOfSpeech: updatedPOS });
  };

  const toggleHasExample = () => {
    const newValue = filters.hasExample === true ? null : true;
    handleFilterChange({ ...filters, hasExample: newValue });
  };

  const clearFilters = () => {
    const emptyFilters: CardFiltersState = {
      levels: [],
      popularity: [],
      partOfSpeech: [],
      hasExample: null,
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const activeFilterCount =
    filters.levels.length +
    filters.popularity.length +
    filters.partOfSpeech.length +
    (filters.hasExample !== null ? 1 : 0);

  return (
    <div className="relative">
      <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="gap-2">
        Bộ lọc
        {activeFilterCount > 0 && (
          <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold leading-none text-white transform bg-red-600 rounded-full">
            {activeFilterCount}
          </span>
        )}
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-background border border-border rounded-lg shadow-lg p-4 z-50">
          {/* Levels */}
          <div className="mb-4">
            <h3 className="font-semibold text-sm mb-2">Mức độ</h3>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((level) => (
                <button
                  key={level}
                  onClick={() => toggleLevel(level)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.levels.includes(level)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Popularity */}
          <div className="mb-4">
            <h3 className="font-semibold text-sm mb-2">Độ nổi tiếng</h3>
            <div className="flex flex-wrap gap-2">
              {POPULARITY_LEVELS.map((pop) => (
                <button
                  key={pop}
                  onClick={() => togglePopularity(pop as CardPopularity)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.popularity.includes(pop as CardPopularity)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                  title={POPULARITY_LABELS[pop as CardPopularity]}
                >
                  {pop}
                </button>
              ))}
            </div>
          </div>

          {/* Part of Speech */}
          <div className="mb-4">
            <h3 className="font-semibold text-sm mb-2">Loại từ</h3>
            <div className="flex flex-wrap gap-2">
              {PARTS_OF_SPEECH.map((pos) => (
                <button
                  key={pos}
                  onClick={() => togglePartOfSpeech(pos)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    filters.partOfSpeech.includes(pos)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          {/* Has Example */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hasExample === true}
                onChange={toggleHasExample}
                className="rounded"
              />
              <span className="text-sm">Có ví dụ</span>
            </label>
          </div>

          {/* Clear Button */}
          {activeFilterCount > 0 && (
            <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
              Xóa tất cả bộ lọc
            </Button>
          )}
        </div>
      )}

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
};
