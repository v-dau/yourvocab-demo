import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  CardSearchBar,
  CardFilters,
  CardListView,
  CardDetailsModal,
  DisplayModeToolbar,
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
import { useCardFilter, useCardOperations } from '@/hooks';
import { useTranslation } from 'react-i18next';
import * as cardService from '@/services/cardService';
import { toast } from 'sonner';
import { Trash2, RotateCcw } from 'lucide-react';

export default function TrashPage() {
  // Modal state
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [cardToRestore, setCardToRestore] = useState<string | null>(null);
  const [cardToHardDelete, setCardToHardDelete] = useState<string | null>(null);
  const [showRestoreAllDialog, setShowRestoreAllDialog] = useState(false);
  const [showEmptyTrashDialog, setShowEmptyTrashDialog] = useState(false);

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
    hasIpa: null,
    hasSynonyms: null,
    hasAntonyms: null,
    hasNearSynonyms: null,
    hasDefinition: null,
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

  const handleRestore = (cardId: string) => setCardToRestore(cardId);
  const confirmRestore = async () => {
    if (!cardToRestore) return;
    try {
      await cardService.restoreCard(cardToRestore);
      deleteCard(cardToRestore);
      toast.success(t('trash_page.restore_success'));
      window.dispatchEvent(new Event('trash-updated'));
    } catch (error) {
      console.error('Restore failed:', error);
      toast.error(t('trash_page.restore_fail'));
    } finally {
      setCardToRestore(null);
    }
  };

  const handleHardDelete = (cardId: string) => setCardToHardDelete(cardId);
  const confirmHardDelete = async () => {
    if (!cardToHardDelete) return;
    try {
      await cardService.hardDeleteCard(cardToHardDelete);
      deleteCard(cardToHardDelete);
      toast.success(t('trash_page.hard_delete_success'));
      window.dispatchEvent(new Event('trash-updated'));
    } catch (error) {
      console.error('Hard delete failed:', error);
      toast.error(t('trash_page.hard_delete_fail'));
    } finally {
      setCardToHardDelete(null);
    }
  };

  const handleRestoreAll = () => setShowRestoreAllDialog(true);
  const confirmRestoreAll = async () => {
    try {
      setIsLoading(true);
      await cardService.restoreAllCards();
      setCards([]); // Empty the trash view
      toast.success(t('trash_page.restore_all_success'));
      window.dispatchEvent(new Event('trash-updated'));
    } catch (error) {
      console.error('Restore all failed:', error);
      toast.error(t('trash_page.restore_all_fail'));
    } finally {
      setIsLoading(false);
      setShowRestoreAllDialog(false);
    }
  };

  const handleEmptyTrash = () => setShowEmptyTrashDialog(true);
  const confirmEmptyTrash = async () => {
    try {
      setIsLoading(true);
      await cardService.emptyTrash();
      setCards([]); // Empty the trash view
      toast.success(t('trash_page.empty_trash_success'));
      window.dispatchEvent(new Event('trash-updated'));
    } catch (error) {
      console.error('Empty trash failed:', error);
      toast.error(t('trash_page.empty_trash_fail'));
    } finally {
      setIsLoading(false);
      setShowEmptyTrashDialog(false);
    }
  };

  const handleResetAllCards = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-transparent p-6">
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

        {/* Dialogs */}
        <AlertDialog
          open={!!cardToRestore}
          onOpenChange={(open) => !open && setCardToRestore(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('trash_page.restore_title', 'Khôi phục thẻ?')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t(
                  'trash_page.restore_word_confirm',
                  `Bạn có chắc muốn khôi phục thẻ '{{word}}'?`,
                  {
                    word: cards.find((c) => c.id === cardToRestore)?.word,
                  }
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel', 'Hủy')}</AlertDialogCancel>
              <AlertDialogAction onClick={confirmRestore}>
                {t('common.ok', 'Đồng ý')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
          open={!!cardToHardDelete}
          onOpenChange={(open) => !open && setCardToHardDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t('trash_page.hard_delete_title', 'Xóa vĩnh viễn thẻ?')}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t(
                  'trash_page.hard_delete_word_confirm',
                  `Hành động này sẽ xóa thẻ '{{word}}' vĩnh viễn. Bạn có chắc chắn?`,
                  {
                    word: cards.find((c) => c.id === cardToHardDelete)?.word,
                  }
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel', 'Hủy')}</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={confirmHardDelete}>
                {t('common.ok', 'Đồng ý')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showRestoreAllDialog} onOpenChange={setShowRestoreAllDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t('trash_page.restore_all_title', 'Khôi phục tất cả?')}
              </AlertDialogTitle>
              <AlertDialogDescription>{t('trash_page.restore_all_confirm')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel', 'Hủy')}</AlertDialogCancel>
              <AlertDialogAction onClick={confirmRestoreAll}>
                {t('common.ok', 'Đồng ý')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showEmptyTrashDialog} onOpenChange={setShowEmptyTrashDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t('trash_page.empty_trash_title', 'Làm sạch thùng rác?')}
              </AlertDialogTitle>
              <AlertDialogDescription>{t('trash_page.empty_trash_confirm')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel', 'Hủy')}</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={confirmEmptyTrash}>
                {t('common.ok', 'Đồng ý')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
