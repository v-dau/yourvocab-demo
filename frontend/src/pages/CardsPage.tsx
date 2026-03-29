import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  CardSearchBar,
  CardFilters,
  CardListView,
  CardDetailsModal,
  DisplayModeToolbar,
} from '@/components/cards';
import type { Card } from '@/types/card';
import type { CardFiltersState } from '@/components/cards/CardFilters';
import { useCardFilter, useCardOperations } from '@/hooks';
import { Plus } from 'lucide-react';
import * as cardService from '@/services/cardService';
import { toast } from 'sonner';

const CardsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cards, setCards, deleteCard } = useCardOperations([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<CardFiltersState>({
    levels: [],
    popularity: [],
    partOfSpeech: [],
    hasExample: null,
  });
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setIsLoading(true);
        const fetchedCards = await cardService.getCards();
        setCards(fetchedCards);
      } catch (error) {
        console.error('Failed to fetch cards:', error);
        toast.error('Failed to load cards. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [setCards]);

  // Use hook để filter danh sách thẻ
  const filteredCards = useCardFilter({
    cards,
    searchQuery,
    filters,
  });

  // CRUD Operations
  const handleCreate = () => {
    navigate('/cards/create');
  };

  const handleEdit = (card: Card) => {
    navigate(`/cards/edit/${card.id}`);
  };

  const handleDelete = async (cardId: string) => {
    if (!window.confirm(t('cards_page.confirm_trash'))) return;

    try {
      await cardService.deleteCard(cardId);
      deleteCard(cardId);
      toast.success(t('cards_page.success_trash'));
    } catch (error) {
      console.error('Failed to delete card:', error);
      toast.error(t('cards_page.error_trash'));
    }
  };

  const handleView = (card: Card) => {
    setSelectedCard(card);
  };

  const handleResetAllCards = () => {
    // This callback could be used to force refresh all cards
    // For now, it's handled by the global display mode sync
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background p-6 bg-gradient-blue">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div>
              <h1 className="text-4xl font-bold text-foreground">{t('cards_page.title')}</h1>
              <p className="text-muted-foreground mt-1">
                {t('cards_page.desc', { count: filteredCards.length })}
              </p>
            </div>
            <Button onClick={handleCreate} className="gap-2 h-10 px-4">
              <Plus className="h-5 w-5" />
              <span>{t('cards_page.add_new')}</span>
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <CardSearchBar searchQuery={searchQuery} onSearch={setSearchQuery} />
          </div>
          <div className="flex items-center gap-2">
            <CardFilters onFilterChange={setFilters} />
            <DisplayModeToolbar onResetAllCards={handleResetAllCards} />
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-4 text-sm text-muted-foreground">
          {isLoading ? (
            t('cards_page.loading')
          ) : (
            <>
              {t('cards_page.showing', { filtered: filteredCards.length, total: cards.length })}
              {searchQuery && t('cards_page.search_for', { query: searchQuery })}
            </>
          )}
        </div>

        {/* Cards Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-xl text-muted-foreground">{t('cards_page.loading')}</p>
          </div>
        ) : (
          <CardListView
            cards={filteredCards}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        )}

        {/* Card Details Modal */}
        <CardDetailsModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      </div>
    </div>
  );
};

export default CardsPage;
