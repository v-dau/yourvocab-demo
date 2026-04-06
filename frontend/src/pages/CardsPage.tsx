import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  CardSearchBar,
  CardFilters,
  CardSort,
  CardListView,
  CardDetailsModal,
  DisplayModeToolbar,
  CardsPagination,
  TagManagerDialog,
} from '@/components/cards';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Card } from '@/types/card';
import type { CardFiltersState } from '@/components/cards/CardFilters';
import { useCardOperations } from '@/hooks';
import { Plus } from 'lucide-react';
import * as cardService from '@/services/cardService';
import { toast } from 'sonner';

const DEFAULT_SORT_CONFIG: { sortBy: 'created_at' | 'word'; sortOrder: 'asc' | 'desc' } = {
  sortBy: 'created_at',
  sortOrder: 'desc',
};

const DEFAULT_FILTERS: CardFiltersState = {
  levels: [],
  popularity: [],
  partOfSpeech: [],
  hasExample: null,
  hasIpa: null,
  hasSynonyms: null,
  hasAntonyms: null,
  hasNearSynonyms: null,
  hasDefinition: null,
  hasCompletedReview: null,
  tags: [],
};

const CardsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const { cards, setCards, deleteCard } = useCardOperations([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [sortConfig, setSortConfig] = useState<{
    sortBy: 'created_at' | 'word';
    sortOrder: 'asc' | 'desc';
  }>(() => {
    try {
      const saved = localStorage.getItem('cardsSortConfig');
      return saved ? JSON.parse(saved) : DEFAULT_SORT_CONFIG;
    } catch {
      return DEFAULT_SORT_CONFIG;
    }
  });

  const [filters, setFilters] = useState<CardFiltersState>(() => {
    try {
      const saved = localStorage.getItem('cardsFilters');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_FILTERS, ...parsed, tags: parsed.tags || [] };
      }
      return DEFAULT_FILTERS;
    } catch {
      return DEFAULT_FILTERS;
    }
  });

  useEffect(() => {
    localStorage.setItem('cardsSortConfig', JSON.stringify(sortConfig));
  }, [sortConfig]);

  useEffect(() => {
    localStorage.setItem('cardsFilters', JSON.stringify(filters));
  }, [filters]);
  const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0, limit: 9 });
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
          limit: 9,
          sortBy: sortConfig.sortBy,
          sortOrder: sortConfig.sortOrder,
        };

        if (searchQuery) params.search = searchQuery;
        if (filters.search) params.search = filters.search;
        if (filters.levels.length > 0) params.levels = filters.levels.join(',');
        if (filters.popularity.length > 0) params.popularity = filters.popularity.join(',');
        if (filters.partOfSpeech.length > 0) params.partOfSpeech = filters.partOfSpeech.join(',');
        if (filters.hasExample) params.hasExample = true;
        if (filters.hasIpa) params.hasIpa = true;
        if (filters.hasSynonyms) params.hasSynonyms = true;
        if (filters.hasAntonyms) params.hasAntonyms = true;
        if (filters.hasNearSynonyms) params.hasNearSynonyms = true;
        if (filters.hasDefinition) params.hasDefinition = true;
        if (filters.hasCompletedReview) params.hasCompletedReview = true;
        if (filters.tags && filters.tags.length > 0) params.tags = filters.tags.join(',');

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
  }, [setCards, currentPage, searchQuery, filters, sortConfig, refreshTrigger]);

  // CRUD Operations
  const handleCreate = () => {
    navigate('/cards/create');
  };

  const handleEdit = (card: Card) => {
    navigate(`/cards/edit/${card.id}`);
  };

  const handleDelete = (cardId: string) => {
    setCardToDelete(cardId);
  };

  const confirmDelete = async () => {
    if (!cardToDelete) return;
    try {
      await cardService.deleteCard(cardToDelete);
      deleteCard(cardToDelete);
      toast.success(t('cards_page.success_trash'));
      window.dispatchEvent(new Event('trash-updated'));
    } catch (error) {
      console.error('Failed to delete card:', error);
      toast.error(t('cards_page.error_trash'));
    } finally {
      setCardToDelete(null);
    }
  };

  const handleView = (card: Card) => {
    setSelectedCard(card);
  };

  const handleResetAllCards = () => {
    // Reset filters, sorts and clear search query
    setSortConfig(DEFAULT_SORT_CONFIG);
    setFilters(DEFAULT_FILTERS);
    setSearchQuery('');

    // Reset pagination to first page
    setSearchParams((prev: URLSearchParams) => {
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <div className="min-h-screen bg-transparent p-6">
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
          <div className="flex items-center justify-end gap-2 flex-wrap">
            <CardSort currentSort={sortConfig} onSortChange={setSortConfig} />
            <CardFilters currentFilters={filters} onFilterChange={setFilters} />
            <DisplayModeToolbar onResetAllCards={handleResetAllCards} />
            <TagManagerDialog onTagsChange={() => setRefreshTrigger((prev) => prev + 1)} />
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

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!cardToDelete} onOpenChange={(open) => !open && setCardToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t('cards_page.confirm_trash_title', 'Chuyển vào thùng rác?')}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t(
                  'cards_page.confirm_trash_word',
                  `Bạn có chắc muốn chuyển thẻ '{{word}}' vào thùng rác?`,
                  {
                    word: cards.find((c) => c.id === cardToDelete)?.word,
                  }
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel', 'Hủy')}</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={confirmDelete}>
                {t('common.ok', 'Đồng ý')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default CardsPage;
