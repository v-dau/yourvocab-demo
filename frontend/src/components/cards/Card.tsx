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
  PenLine,
  ArrowLeft,
  Send,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card as CardUI } from '@/components/ui/card';
import api from '@/lib/axios';
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

  // States for practice mode
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [sentences, setSentences] = useState<
    { id: string; content: string; card_id: string; created_at: string }[]
  >([]);
  const [isLoadingSentences, setIsLoadingSentences] = useState(false);
  const [newSentence, setNewSentence] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load sentences when practice mode is enabled
  useEffect(() => {
    if (isPracticeMode) {
      const fetchSentences = async () => {
        try {
          setIsLoadingSentences(true);
          const res = await api.get(`/cards/${card.id}/sentences`);
          setSentences(res.data);
        } catch (error) {
          console.error('Failed to load sentences:', error);
        } finally {
          setIsLoadingSentences(false);
        }
      };
      fetchSentences();
    }
  }, [isPracticeMode, card.id]);

  const handleCreateSentence = async () => {
    if (!newSentence.trim()) return;
    try {
      const res = await api.post(`/cards/${card.id}/sentences`, { sentence: newSentence });
      setSentences((prev) => [...prev, res.data]);
      setNewSentence('');
    } catch (error) {
      console.error('Failed to create sentence:', error);
    }
  };

  const handleUpdateSentence = async (id: string) => {
    if (!editValue.trim()) return;
    try {
      const res = await api.put(`/sentences/${id}`, { sentence: editValue });
      setSentences((prev) => prev.map((s) => (s.id === id ? res.data : s)));
      setEditingId(null);
    } catch (error) {
      console.error('Failed to update sentence:', error);
    }
  };

  const handleDeleteSentence = async (id: string) => {
    try {
      await api.delete(`/sentences/${id}`);
      setSentences((prev) => prev.filter((s) => s.id !== id));
      setDeletingId(null);
    } catch (error) {
      console.error('Failed to delete sentence:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleCreateSentence();
  };

  const readOnlyPractice = isReviewMode || isTrashMode;

  const renderPracticeMode = () => (
    <div className="flex flex-col h-full min-h-[300px] mt-2">
      {/* Top Header */}
      <div className="flex items-center gap-2 mb-4 border-b border-b-muted pb-3">
        <button
          onClick={() => setIsPracticeMode(false)}
          className="p-1 hover:bg-muted rounded text-muted-foreground mr-2 transition-colors"
          title={t('practice.back_btn')}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h3 className="font-semibold text-lg text-primary line-clamp-1">{t('practice.title')}</h3>
      </div>

      {/* Middle Scrollable list */}
      <div className="flex-1 overflow-y-auto max-h-60 custom-scrollbar mb-4 space-y-3 pr-2">
        {isLoadingSentences ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : sentences.length === 0 ? (
          <div className="text-center text-muted-foreground italic h-full flex flex-col items-center justify-center py-6">
            <BookOpen className="h-8 w-8 mb-2 opacity-50" />
            <p>{t('practice.empty')}</p>
          </div>
        ) : (
          sentences.map((s, index) => (
            <div key={s.id} className="bg-muted/50 p-3 rounded-md transition-colors hover:bg-muted">
              {editingId === s.id ? (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-muted-foreground text-sm">{index + 1}.</span>
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-8 text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleUpdateSentence(s.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                  />
                  <button
                    onClick={() => handleUpdateSentence(s.id)}
                    className="text-green-600 hover:bg-green-100 p-1.5 rounded transition-colors shrink-0"
                    title={t('common.ok', 'Lưu')}
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-muted-foreground hover:bg-muted p-1.5 rounded transition-colors shrink-0"
                    title={t('common.cancel', 'Hủy')}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <div className="flex items-start justify-between gap-3 group">
                    <p className="text-sm">
                      <span className="font-medium mr-2 text-muted-foreground">{index + 1}.</span>
                      {s.content}
                    </p>
                    {!readOnlyPractice && (
                      <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingId(s.id);
                            setEditValue(s.content);
                            setDeletingId(null);
                          }}
                          className="p-1 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingId(s.id);
                            setEditingId(null);
                          }}
                          className="p-1 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {deletingId === s.id && !readOnlyPractice && (
                    <div className="mt-2 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-2 rounded flex items-center justify-between border border-red-200 dark:border-red-900/50">
                      <span className="font-medium">{t('practice.confirm_delete')}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteSentence(s.id)}
                          className="font-bold hover:underline"
                        >
                          {t('practice.btn_delete')}
                        </button>
                        <button
                          onClick={() => setDeletingId(null)}
                          className="hover:underline text-muted-foreground"
                        >
                          {t('practice.btn_cancel')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Bottom Footer Input */}
      {!readOnlyPractice && (
        <div className="flex gap-2 mt-auto pt-2 border-t border-t-muted">
          <Input
            value={newSentence}
            onChange={(e) => setNewSentence(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('practice.placeholder')}
            className="flex-1"
          />
          <Button onClick={handleCreateSentence} size="icon" disabled={!newSentence.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );

  // Sync localMode và globalDisplayMode khi globalDisplayMode thay đổi
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
        <div className="flex items-center gap-3 flex-1 flex-wrap min-w-0">
          <div className="flex items-center gap-2 min-w-0 max-w-full">
            <h2 className="text-3xl font-bold text-primary break-all line-clamp-2 md:line-clamp-none">
              {card.word}
            </h2>
            {card.isCompleted && (
              <span
                title={t('cards_page.filters.has_completed_review', 'Đã hoàn thành ôn tập')}
                className="flex-shrink-0 mt-1"
              >
                <CheckCircle className="w-7 h-7 text-green-500" />
              </span>
            )}
          </div>
          {card.level && (
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm font-semibold whitespace-nowrap">
              {card.level}
            </span>
          )}
        </div>
        {/* Actions Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setIsPracticeMode(!isPracticeMode)}
            className={`p-1.5 rounded-md transition-colors ${
              isPracticeMode
                ? 'bg-primary/20 text-primary'
                : 'hover:bg-muted/60 text-muted-foreground'
            }`}
            title={t('practice.tooltip')}
          >
            <PenLine className="h-5 w-5" />
          </button>

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
      </div>

      {isPracticeMode ? (
        renderPracticeMode()
      ) : (
        <div className="flex flex-col h-full">
          {/* Row 2: IPA */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-3">
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
              <button
                className="p-1.5 hover:bg-muted/60 rounded-md transition-colors"
                title="Image"
              >
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              </button>
              <button
                className="p-1.5 hover:bg-muted/60 rounded-md transition-colors"
                title="Google"
              >
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

          {/* Row 5: Meaning */}
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
              <h4 className="text-sm font-semibold text-card-foreground mb-1">
                {t('card.example')}
              </h4>
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
              {/* Definition */}
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
                const tagNameStr = (
                  currentTag.tagName ||
                  currentTag.tag_name ||
                  'tag'
                ).toLowerCase();
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
                      <span className="text-xs hidden sm:inline">
                        {t('card.actions.hard_delete')}
                      </span>
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </CardUI>
  );
};
