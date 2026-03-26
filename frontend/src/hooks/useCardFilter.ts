import { useMemo } from 'react';
import type { Card, CardLevel, CardPopularity } from '@/types/card';
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
      if (filters.levels.length > 0 && !filters.levels.includes(card.level as CardLevel)) {
        return false;
      }

      // Popularity filter
      if (
        filters.popularity.length > 0 &&
        !filters.popularity.includes(card.popularity as CardPopularity)
      ) {
        return false;
      }

      // Part of Speech filter
      if (
        filters.partOfSpeech.length > 0 &&
        !filters.partOfSpeech.includes(card.partOfSpeech || '')
      ) {
        return false;
      }

      // Has Example filter
      if (filters.hasExample === true && !card.example) {
        return false;
      }

      return true;
    });
  }, [cards, searchQuery, filters]);

  return filteredCards;
};
