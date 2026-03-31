import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { CardLevel, CardPopularity } from '@/types/card';

interface CardFiltersProps {
  onFilterChange: (filters: CardFiltersState) => void;
}

export interface CardFiltersState {
  search?: string;
  levels: (CardLevel | 'N/A')[];
  popularity: CardPopularity[];
  partOfSpeech: string[];
  hasExample: boolean | null;
  hasIpa: boolean | null;
  hasSynonyms: boolean | null;
  hasAntonyms: boolean | null;
  hasNearSynonyms: boolean | null;
  hasDefinition: boolean | null;
}

const LEVELS: (CardLevel | 'N/A')[] = ['N/A', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const POPULARITY_LEVELS: CardPopularity[] = [0, 1, 2, 3, 4, 5];
const PARTS_OF_SPEECH = [
  'Noun',
  'Verb',
  'Adjective',
  'Adverb',
  'Pronoun',
  'Preposition',
  'Conjunction',
  'Interjection',
];

export const CardFilters: React.FC<CardFiltersProps> = ({ onFilterChange }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<CardFiltersState>({
    levels: [],
    popularity: [],
    partOfSpeech: [],
    hasExample: null,
    hasIpa: null,
    hasSynonyms: null,
    hasAntonyms: null,
    hasNearSynonyms: null,
    hasDefinition: null,
  });

  const handleFilterChange = (newFilters: CardFiltersState) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleLevel = (level: CardLevel | 'N/A') => {
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

  const toggleBooleanFilter = (key: keyof CardFiltersState) => {
    const newValue = filters[key] === true ? null : true;
    handleFilterChange({ ...filters, [key]: newValue });
  };

  const clearFilters = () => {
    const emptyFilters: CardFiltersState = {
      levels: [],
      popularity: [],
      partOfSpeech: [],
      hasExample: null,
      hasIpa: null,
      hasSynonyms: null,
      hasAntonyms: null,
      hasNearSynonyms: null,
      hasDefinition: null,
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const activeFilterCount =
    filters.levels.length +
    filters.popularity.length +
    filters.partOfSpeech.length +
    (filters.hasExample !== null ? 1 : 0) +
    (filters.hasIpa !== null ? 1 : 0) +
    (filters.hasSynonyms !== null ? 1 : 0) +
    (filters.hasAntonyms !== null ? 1 : 0) +
    (filters.hasNearSynonyms !== null ? 1 : 0) +
    (filters.hasDefinition !== null ? 1 : 0);

  return (
    <div className="relative">
      <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="gap-2">
        {t('cards_page.filters.filter_btn')}
        {activeFilterCount > 0 && (
          <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold leading-none text-white transform bg-red-600 rounded-full">
            {activeFilterCount}
          </span>
        )}
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Filter dropdown */}
          <div className="absolute top-full left-0 mt-2 w-80 max-h-96 bg-background border border-border rounded-lg shadow-lg p-4 z-50 overflow-y-auto">
            {/* Levels */}
            <div className="mb-4">
              <h3 className="font-semibold text-sm mb-2">{t('cards_page.filters.level')}</h3>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((level) => (
                  <button
                    key={level}
                    onClick={() => toggleLevel(level)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors whitespace-nowrap ${
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
              <h3 className="font-semibold text-sm mb-2">{t('cards_page.filters.popularity')}</h3>
              <div className="flex flex-wrap gap-2">
                {POPULARITY_LEVELS.map((pop) => (
                  <button
                    key={pop}
                    onClick={() => togglePopularity(pop as CardPopularity)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors whitespace-nowrap ${
                      filters.popularity.includes(pop as CardPopularity)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                    title={t(
                      `card.popularity.${['na', 'extremely_rare', 'rare', 'uncommon', 'common', 'essentials'][pop as number] || 'na'}`
                    )}
                  >
                    {pop}
                  </button>
                ))}
              </div>
            </div>

            {/* Part of Speech */}
            <div className="mb-4">
              <h3 className="font-semibold text-sm mb-2">
                {t('cards_page.filters.part_of_speech')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {PARTS_OF_SPEECH.map((pos) => (
                  <button
                    key={pos}
                    onClick={() => togglePartOfSpeech(pos)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors whitespace-nowrap ${
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

            {/* Boolean Filters */}
            <div className="mb-4 grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.hasExample === true}
                  onChange={() => toggleBooleanFilter('hasExample')}
                  className="rounded"
                />
                <span className="text-sm">
                  {t('cards_page.filters.has_example', 'Has example')}
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.hasIpa === true}
                  onChange={() => toggleBooleanFilter('hasIpa')}
                  className="rounded"
                />
                <span className="text-sm">{t('cards_page.filters.has_ipa', 'Has IPA')}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.hasDefinition === true}
                  onChange={() => toggleBooleanFilter('hasDefinition')}
                  className="rounded"
                />
                <span className="text-sm">
                  {t('cards_page.filters.has_definition', 'Has definition')}
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.hasSynonyms === true}
                  onChange={() => toggleBooleanFilter('hasSynonyms')}
                  className="rounded"
                />
                <span className="text-sm">
                  {t('cards_page.filters.has_synonyms', 'Has synonyms')}
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.hasAntonyms === true}
                  onChange={() => toggleBooleanFilter('hasAntonyms')}
                  className="rounded"
                />
                <span className="text-sm">
                  {t('cards_page.filters.has_antonyms', 'Has antonyms')}
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.hasNearSynonyms === true}
                  onChange={() => toggleBooleanFilter('hasNearSynonyms')}
                  className="rounded"
                />
                <span className="text-sm">
                  {t('cards_page.filters.has_near_synonyms', 'Has near-synonyms')}
                </span>
              </label>
            </div>

            {/* Clear Button */}
            {activeFilterCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
                {t('cards_page.filters.clear_all')}
              </Button>
            )}
          </div>
        </>
      )}

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
};
