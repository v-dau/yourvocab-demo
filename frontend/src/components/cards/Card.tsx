import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Star,
  Image as ImageIcon,
  Globe,
  BookOpen,
  Edit2,
  Trash2,
  Eye,
  Maximize2,
  Minimize2,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card as CardUI } from '@/components/ui/card';
import { useDisplayMode } from '@/stores/displayModeStore';
import type { Card as CardType } from '@/types/card';
import { formatDistanceToNow, addDays } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

interface CardProps {
  card: CardType;
  onAddMeaning?: () => void;
  onEdit?: (card: CardType) => void;
  onDelete?: (cardId: string) => void;
  onView?: (card: CardType) => void;
  onRestore?: (cardId: string) => void;
  onHardDelete?: (cardId: string) => void;
  isSelected?: boolean;
  showActions?: boolean;
  isTrashMode?: boolean;
  isReviewMode?: boolean;
  stepIndex?: number;
  onFinishReview?: (cardId: string) => void;
}

/**
 * Helper function: Returns popularity styling based on value
 */
const getPopularityStyle = (popularity?: number | null, t?: TFunction) => {
  const value = popularity ?? 0;

  if (!t)
    return {
      iconColor: 'text-gray-400',
      text: 'N/A',
      bgColor: 'bg-gray-100',
      innerTextColor: 'text-transparent',
    };

  const config = {
    0: {
      iconColor: 'text-gray-400',
      text: t('card.popularity.na'),
      bgColor: 'bg-gray-100',
      innerTextColor: 'text-transparent',
    },
    1: {
      iconColor: 'text-red-500',
      text: t('card.popularity.extremely_rare'),
      bgColor: 'bg-red-50',
      innerTextColor: 'text-white',
    },
    2: {
      iconColor: 'text-orange-500',
      text: t('card.popularity.rare'),
      bgColor: 'bg-orange-50',
      innerTextColor: 'text-white',
    },
    3: {
      iconColor: 'text-yellow-500',
      text: t('card.popularity.uncommon'),
      bgColor: 'bg-yellow-50',
      innerTextColor: 'text-yellow-950 dark:text-yellow-950',
    },
    4: {
      iconColor: 'text-green-500',
      text: t('card.popularity.common'),
      bgColor: 'bg-green-50',
      innerTextColor: 'text-white',
    },
    5: {
      iconColor: 'text-blue-500',
      text: t('card.popularity.essentials'),
      bgColor: 'bg-blue-50',
      innerTextColor: 'text-white',
    },
  } as const;

  return config[value as keyof typeof config] || config[0];
};

export const Card: React.FC<CardProps> = ({
  card,
  onAddMeaning,
  onEdit,
  onDelete,
  onView,
  isSelected = false,
  showActions = false,
  isTrashMode = false,
  onRestore,
  onHardDelete,
  isReviewMode = false,
  stepIndex = 0,
  onFinishReview,
}) => {
  const { globalDisplayMode } = useDisplayMode();
  const [localMode, setLocalMode] = useState<'basic' | 'full'>(globalDisplayMode);
  const { t, i18n } = useTranslation();
  const popularityStyle = getPopularityStyle(card.popularity, t);
  const currentLocale = i18n.language === 'vi' ? vi : enUS;

  // Sync localMode vá»›i globalDisplayMode khi globalDisplayMode thay Ä‘á»•i
  useEffect(() => {
    setLocalMode(globalDisplayMode);
  }, [globalDisplayMode]);

  const toggleLocalMode = () => {
    setLocalMode(localMode === 'basic' ? 'full' : 'basic');
  };

  return (
    <CardUI
      className={`p-6 transition-all duration-300 ${isSelected ? 'ring-1 ring-primary/20 shadow-md' : 'shadow-sm hover:shadow-md'}`}
    >
      {/* Row 1: Header - Word + Level Badge + Toggle Button */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <h2 className="text-3xl font-bold text-primary break-words">{card.word}</h2>
          {card.level && (
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm font-semibold whitespace-nowrap">
              {card.level}
            </span>
          )}
        </div>
        {/* Toggle Display Mode Button */}
        <button
          onClick={toggleLocalMode}
          className="p-1.5 hover:bg-muted/60 rounded-md transition-colors shrink-0"
          title={localMode === 'basic' ? 'Expand' : 'Collapse'}
        >
          {localMode === 'basic' ? (
            <Maximize2 className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Minimize2 className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Row 2: IPA - PhÃ¡t Ã¢m */}
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Volume2 className="h-5 w-5" />
        {card.ipa && <span className="font-mono text-card-foreground">/{card.ipa}/</span>}
      </div>

      {/* Row 3: Popularity & Actions */}
      <div className="flex items-center justify-between">
        {/* Left: Popularity */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            {!card.popularity ? (
              <Star className={`h-6 w-6 ${popularityStyle.iconColor}`} />
            ) : (
              <>
                <Star
                  className={`h-6 w-6 ${popularityStyle.iconColor}`}
                  fill="currentColor"
                  strokeWidth={1.5}
                />
                <span className="absolute text-[11px] font-bold leading-none text-white pt-[1.5px]">
                  {card.popularity}
                </span>
              </>
            )}
          </div>
          <span className={`text-sm font-medium ${popularityStyle.iconColor}`}>
            {popularityStyle.text}
          </span>
        </div>

        {/* Right: Action Icons */}
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-muted/60 rounded-md transition-colors" title="Image">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </button>
          <button className="p-1.5 hover:bg-muted/60 rounded-md transition-colors" title="Google">
            <Globe className="h-4 w-4 text-muted-foreground" />
          </button>
          <button className="p-1.5 hover:bg-muted/60 rounded-md transition-colors" title="Wiki">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Row 4: Part of Speech */}
      <div className="border-t border-t-muted">
        <p
          className={`font-semibold text-sm mt-2 ${card.partOfSpeech ? 'text-orange-500' : 'text-gray-600 dark:text-gray-300'}`}
        >
          {card.partOfSpeech || 'N/A'}
        </p>
      </div>

      {/* Row 5: Meaning - NghÄ©a tiáº¿ng Viá»‡t */}
      <div className="bg-muted p-3 rounded-md flex justify-between items-center mb-4">
        <p className="text-card-foreground font-medium flex-1">{card.meaning}</p>
        {onAddMeaning && (
          <Button size="sm" className="ml-3 whitespace-nowrap" onClick={onAddMeaning}>
            {t('card.add')}
          </Button>
        )}
      </div>

      {/* Row 6: Example - Always show in Basic mode */}
      {card.example && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-card-foreground mb-1">{t('card.example')}</h4>
          <p className="text-sm italic bg-muted p-2 rounded border-l-4 border-primary text-card-foreground">
            "{card.example}"
          </p>
        </div>
      )}

      {/* FULL MODE SECTION - Only show when localMode === 'full' */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          localMode === 'full' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-4">
          {/* Definition - Äá»‹nh nghÄ©a */}
          {card.definition && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-card-foreground mb-1">
                {t('card.definition')}
              </h4>
              <p className="text-sm text-muted-foreground">{card.definition}</p>
            </div>
          )}

          {/* Synonyms */}
          {card.synonyms && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('card.synonyms')}</h4>
              <div className="flex flex-wrap gap-2">
                {card.synonyms.split(',').map((syn, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-xs rounded"
                  >
                    {syn.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Antonyms */}
          {card.antonyms && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('card.antonyms')}</h4>
              <div className="flex flex-wrap gap-2">
                {card.antonyms.split(',').map((ant, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 text-xs rounded"
                  >
                    {ant.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Near Synonyms */}
          {card.nearSynonyms && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                {t('card.near_synonyms')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {card.nearSynonyms.split(',').map((near, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 text-xs rounded"
                  >
                    {near.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tags Display */}
      {card.tags && card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {card.tags.map((tag) => {
            // Use type narrowing to safely access tag properties
            const currentTag = tag as { id: string; tagName?: string; tag_name?: string };
            const tagNameStr = (currentTag.tagName || currentTag.tag_name || 'tag').toLowerCase();
            return (
              <span
                key={tag.id}
                className="bg-secondary text-muted-foreground rounded-sm px-1.5 py-0.5 text-xs inline-flex items-center"
              >
                #{tagNameStr}
              </span>
            );
          })}
        </div>
      )}

      {/* Trash info */}
      {isTrashMode && card.deletedAt && (
        <div className="mt-2 text-xs text-red-500 font-medium">
          {t('card.trash_info', {
            time: formatDistanceToNow(addDays(new Date(card.deletedAt), 14), {
              locale: currentLocale,
            }),
          })}
        </div>
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="flex gap-2 pt-4 border-t border-t-muted transition-all duration-300 mt-auto">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(card)}
              title={t('card.actions.view_title')}
              className="flex-1 gap-2"
            >
              <Eye className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">{t('card.actions.view')}</span>
            </Button>
          )}

          {isReviewMode && onFinishReview ? (
            <Button
              variant="default"
              size="sm"
              onClick={() => onFinishReview(card.id)}
              className="flex-1 gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">
                {stepIndex === 5 ? t('review_page.btn_complete') : t('review_page.btn_finish')}
              </span>
            </Button>
          ) : (
            <>
              {!isTrashMode && onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(card)}
                  title={t('card.actions.edit_title')}
                  className="flex-1 gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  <span className="text-xs hidden sm:inline">{t('card.actions.edit')}</span>
                </Button>
              )}
              {!isTrashMode && onDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(card.id)}
                  title={t('card.actions.move_to_trash')}
                  className="flex-1 gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              {isTrashMode && onRestore && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRestore(card.id)}
                  title={t('card.actions.restore_title')}
                  className="flex-1 gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="text-xs hidden sm:inline">{t('card.actions.restore')}</span>
                </Button>
              )}
              {isTrashMode && onHardDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onHardDelete(card.id)}
                  title={t('card.actions.hard_delete_title')}
                  className="flex-1 gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="text-xs hidden sm:inline">{t('card.actions.hard_delete')}</span>
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </CardUI>
  );
};
