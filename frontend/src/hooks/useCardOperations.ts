import { useState, useCallback } from 'react';
import type { Card } from '@/types/card';

export const useCardOperations = (initialCards: Card[]) => {
  const [cards, setCards] = useState<Card[]>(initialCards);

  const addCard = useCallback((card: Card) => {
    setCards((prev) => [card, ...prev]);
  }, []);

  const updateCard = useCallback((cardId: string, updatedCard: Partial<Card>) => {
    setCards((prev) =>
      prev.map((card) => (card.id === cardId ? { ...card, ...updatedCard } : card))
    );
  }, []);

  const deleteCard = useCallback((cardId: string) => {
    setCards((prev) => prev.filter((card) => card.id !== cardId));
  }, []);

  const resetCards = useCallback(() => {
    setCards(initialCards);
  }, [initialCards]);

  return {
    cards,
    setCards,
    addCard,
    updateCard,
    deleteCard,
    resetCards,
  };
};
