import { useMemo } from 'react';
import type { Card, CardPopularity } from '@/types/card';
import type { CardFiltersState } from '@/components/cards/CardFilters';

interface UseCardFilterOptions {
  cards: Card[];
  searchQuery: string;
  filters: CardFiltersState;
}

export const useCardFilter = ({ cards, searchQuery, filters }: UseCardFilterOptions) => {
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        card.word.toLowerCase().includes(searchLower) ||
        card.meaning.toLowerCase().includes(searchLower) ||
        card.definition?.toLowerCase().includes(searchLower) ||
        card.example?.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      // Level filter
      if (filters.levels.length > 0) {
        const hasNA = filters.levels.includes('N/A');
        const levelMatches = filters.levels.includes(card.level as any) || (hasNA && !card.level);
        if (!levelMatches) return false;
      }

      // Popularity filter
      if (filters.popularity.length > 0) {
        const popValue = card.popularity ?? 0;
        if (!filters.popularity.includes(popValue as CardPopularity)) {
          return false;
        }
      }

      // Part of Speech filter
      if (
        filters.partOfSpeech.length > 0 &&
        !filters.partOfSpeech.includes(card.partOfSpeech || '')
      ) {
        return false;
      }

      // Boolean filters
      if (filters.hasExample === true && !card.example) return false;
      if (filters.hasIpa === true && !card.ipa) return false;
      if (filters.hasDefinition === true && !card.definition) return false;
      if (filters.hasSynonyms === true && !card.synonyms) return false;
      if (filters.hasAntonyms === true && !card.antonyms) return false;
      if (filters.hasNearSynonyms === true && !card.nearSynonyms) return false;

      return true;
    });
  }, [cards, searchQuery, filters]);

  return filteredCards;
};
