import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  CardSearchBar,
  CardFilters,
  CardListView,
  CardDetailsModal,
  DisplayModeToolbar,
  CardsPagination,
  TagManagerDialog,
} from '@/components/cards';
import type { Card } from '@/types/card';
import type { CardFiltersState } from '@/components/cards/CardFilters';
import { useCardOperations } from '@/hooks';
import { Plus } from 'lucide-react';
import * as cardService from '@/services/cardService';
import { toast } from 'sonner';

const CardsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
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
  const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0, limit: 12 });
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const handlePageChange = (page: number) => {
    setSearchParams((prev: URLSearchParams) => {
      prev.set('page', page.toString());
      return prev;
    });
  };

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setIsLoading(true);
        const params: Record<string, string | number | boolean> = {
          page: currentPage,
          limit: 12,
        };

        if (searchQuery) params.search = searchQuery;
        if (filters.levels.length > 0) params.levels = filters.levels.join(',');
        if (filters.popularity.length > 0) params.popularity = filters.popularity.join(',');
        if (filters.partOfSpeech.length > 0) params.partOfSpeech = filters.partOfSpeech.join(',');
        if (filters.hasExample) params.hasExample = true;

        const result = await cardService.getCards(params);
        setCards(result.data);
        setPagination(result.pagination);
      } catch (error) {
        console.error('Failed to fetch cards:', error);
        toast.error('Failed to load cards. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchCards();
    }, 300);

    return () => clearTimeout(timer);
  }, [setCards, currentPage, searchQuery, filters]);

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
                {t('cards_page.desc', { count: pagination.totalItems })}
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
            <TagManagerDialog />
          </div>
        </div>

        {/* Pagination Top */}
        {!isLoading && pagination.totalPages > 1 && (
          <CardsPagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {/* Results Info */}
        <div className="mb-4 text-sm text-muted-foreground">
          {isLoading ? (
            t('cards_page.loading')
          ) : (
            <>
              {t('cards_page.showing', { filtered: cards.length, total: pagination.totalItems })}
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
            cards={cards}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        )}

        {/* Pagination Bottom */}
        {!isLoading && pagination.totalPages > 1 && (
          <CardsPagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {/* Card Details Modal */}
        <CardDetailsModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      </div>
    </div>
  );
};

export default CardsPage;
