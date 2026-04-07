import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from './Card';
import type { Card as CardType } from '@/types/card';

interface CardListViewProps {
  cards: CardType[];
  onEdit?: (card: CardType) => void;
  onDelete?: (cardId: string) => void;
  onView?: (card: CardType) => void;
  onRestore?: (cardId: string) => void;
  onHardDelete?: (cardId: string) => void;
  isLoading?: boolean;
  isTrashMode?: boolean;
}

export const CardListView: React.FC<CardListViewProps> = ({
  cards,
  onEdit,
  onDelete,
  onView,
  onRestore,
  onHardDelete,
  isLoading = false,
  isTrashMode = false,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="mt-2 text-muted-foreground">{t('cards.loading', 'Đang tải...')}</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-lg">
        <p className="text-muted-foreground">
          {t('cards.no_cards_found', 'Không tìm thấy thẻ nào')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
          onRestore={onRestore}
          onHardDelete={onHardDelete}
          showActions={true}
          isTrashMode={isTrashMode}
        />
      ))}
    </div>
  );
};
