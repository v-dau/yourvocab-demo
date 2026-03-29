import { useState, useEffect } from 'react';
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
import { useTranslation } from 'react-i18next';
import * as cardService from '@/services/cardService';
import { toast } from 'sonner';
import { Trash2, RotateCcw } from 'lucide-react';

export default function TrashPage() {
  // Modal state
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  // Cards state
  const { cards, setCards, deleteCard } = useCardOperations([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();
  const [filters, setFilters] = useState<CardFiltersState>({
    levels: [],
    popularity: [],
    partOfSpeech: [],
    hasExample: null,
  });

  useEffect(() => {
    const fetchTrashCards = async () => {
      try {
        setIsLoading(true);
        const fetchedCards = await cardService.getTrashCards();
        setCards(fetchedCards);
      } catch (error) {
        console.error('Failed to fetch trash cards:', error);
        toast.error(t('trash_page.fetch_error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrashCards();
  }, [setCards, t]);

  const filteredCards = useCardFilter({
    cards,
    searchQuery,
    filters,
  });

  // Actions
  const handleView = (card: Card) => {
    setSelectedCard(card);
  };

  const handleRestore = async (cardId: string) => {
    if (!window.confirm(t('trash_page.restore_confirm'))) return;
    try {
      await cardService.restoreCard(cardId);
      deleteCard(cardId);
      toast.success(t('trash_page.restore_success'));
    } catch (error) {
      console.error('Restore failed:', error);
      toast.error(t('trash_page.restore_fail'));
    }
  };

  const handleHardDelete = async (cardId: string) => {
    if (!window.confirm(t('trash_page.hard_delete_confirm'))) return;
    try {
      await cardService.hardDeleteCard(cardId);
      deleteCard(cardId);
      toast.success(t('trash_page.hard_delete_success'));
    } catch (error) {
      console.error('Hard delete failed:', error);
      toast.error(t('trash_page.hard_delete_fail'));
    }
  };

  const handleRestoreAll = async () => {
    if (!window.confirm(t('trash_page.restore_all_confirm'))) return;
    try {
      setIsLoading(true);
      await cardService.restoreAllCards();
      setCards([]); // Empty the trash view
      toast.success(t('trash_page.restore_all_success'));
    } catch (error) {
      console.error('Restore all failed:', error);
      toast.error(t('trash_page.restore_all_fail'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmptyTrash = async () => {
    if (!window.confirm(t('trash_page.empty_trash_confirm'))) return;
    try {
      setIsLoading(true);
      await cardService.emptyTrash();
      setCards([]); // Empty the trash view
      toast.success(t('trash_page.empty_trash_success'));
    } catch (error) {
      console.error('Empty trash failed:', error);
      toast.error(t('trash_page.empty_trash_fail'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAllCards = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background p-6 bg-gradient-blue">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div>
              <h1 className="text-4xl font-bold text-foreground">{t('trash_page.title')}</h1>
              <p className="text-muted-foreground mt-1">{t('trash_page.subtitle')}</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleRestoreAll}
                variant="outline"
                className="gap-2 h-10 px-4 text-blue-600 border-blue-200 hover:bg-blue-50"
                disabled={cards.length === 0 || isLoading}
              >
                <RotateCcw className="h-4 w-4" />
                <span>{t('trash_page.restore_all')}</span>
              </Button>
              <Button
                onClick={handleEmptyTrash}
                variant="destructive"
                className="gap-2 h-10 px-4"
                disabled={cards.length === 0 || isLoading}
              >
                <Trash2 className="h-4 w-4" />
                <span>{t('trash_page.empty_trash')}</span>
              </Button>
            </div>
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
            t('trash_page.loading_status')
          ) : (
            <>
              {t('trash_page.showing')} {filteredCards.length} {t('trash_page.of')} {cards.length}{' '}
              {t('trash_page.deleted_cards')}
              {searchQuery && ` (${t('trash_page.search')}: "${searchQuery}")`}
            </>
          )}
        </div>

        {/* Cards Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-xl text-muted-foreground">{t('trash_page.loading_trash')}</p>
          </div>
        ) : (
          <CardListView
            cards={filteredCards}
            onView={handleView}
            onRestore={handleRestore}
            onHardDelete={handleHardDelete}
            isTrashMode={true}
          />
        )}

        {/* Card Details Modal */}
        <CardDetailsModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      </div>
    </div>
  );
}
