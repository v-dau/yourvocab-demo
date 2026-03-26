import React from 'react';
import {
  Volume2,
  Star,
  Image as ImageIcon,
  Globe,
  BookOpen,
  Edit2,
  Trash2,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Card as CardType } from '@/types/card';

interface CardProps {
  card: CardType;
  onAddMeaning?: () => void;
  onEdit?: (card: CardType) => void;
  onDelete?: (cardId: string) => void;
  onView?: (card: CardType) => void;
  isSelected?: boolean;
  showActions?: boolean;
}

/**
 * Helper function: Returns popularity styling based on value
 */
const getPopularityStyle = (popularity?: number | null) => {
  const value = popularity ?? 0;
  const config = {
    0: {
      iconColor: 'text-gray-400',
      text: 'N/A',
      bgColor: 'bg-gray-100',
    },
    1: {
      iconColor: 'text-red-500',
      text: 'Extremely rare',
      bgColor: 'bg-red-50',
    },
    2: {
      iconColor: 'text-orange-500',
      text: 'Rare',
      bgColor: 'bg-orange-50',
    },
    3: {
      iconColor: 'text-yellow-500',
      text: 'Uncommon',
      bgColor: 'bg-yellow-50',
    },
    4: {
      iconColor: 'text-green-500',
      text: 'Common',
      bgColor: 'bg-green-50',
    },
    5: {
      iconColor: 'text-blue-500',
      text: 'Essentials',
      bgColor: 'bg-blue-50',
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
}) => {
  const popularityStyle = getPopularityStyle(card.popularity);

  return (
    <div
      className={`
        p-6 rounded-lg border transition-all
        ${isSelected ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-200 bg-white shadow-sm hover:shadow-md'}
      `}
    >
      {/* Row 1: Header - Word + Level Badge */}
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-3xl font-bold text-primary flex-1 break-words">{card.word}</h2>
        {card.level && (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold whitespace-nowrap">
            {card.level}
          </span>
        )}
      </div>

      {/* Row 2: IPA - Phát âm */}
      {card.ipa && (
        <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
          <Volume2 className="h-5 w-5" />
          <span className="font-mono text-gray-700">/{card.ipa}/</span>
        </div>
      )}

      {/* Row 3: Popularity & Actions */}
      <div className="flex items-center justify-between mb-4 pt-2 border-t border-gray-100">
        {/* Left: Popularity */}
        <div className="flex items-center gap-2 mt-3">
          <Star className={`h-5 w-5 ${popularityStyle.iconColor}`} fill="currentColor" />
          <span className={`text-sm font-medium ${popularityStyle.iconColor}`}>
            {popularityStyle.text}
          </span>
        </div>

        {/* Right: Action Icons */}
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors" title="Image">
            <ImageIcon className="h-4 w-4 text-gray-500" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors" title="Google">
            <Globe className="h-4 w-4 text-gray-500" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors" title="Wiki">
            <BookOpen className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Row 4: Part of Speech */}
      {card.partOfSpeech && (
        <div className="mb-4 pt-2 border-t border-gray-100">
          <p className="text-orange-500 font-semibold text-sm mt-2">{card.partOfSpeech}</p>
        </div>
      )}

      {/* Row 5: Meaning - Nghĩa tiếng Việt */}
      <div className="bg-gray-50 p-3 rounded-md flex justify-between items-center mb-4">
        <p className="text-gray-800 font-medium flex-1">{card.meaning}</p>
        {onAddMeaning && (
          <Button size="sm" className="ml-3 whitespace-nowrap" onClick={onAddMeaning}>
            + Add
          </Button>
        )}
      </div>

      {/* Definition - Định nghĩa */}
      {card.definition && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Định nghĩa</h4>
          <p className="text-sm text-gray-600">{card.definition}</p>
        </div>
      )}

      {/* Example - Ví dụ */}
      {card.example && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Ví dụ</h4>
          <p className="text-sm italic text-gray-600 bg-gray-50 p-2 rounded border-l-4 border-primary">
            "{card.example}"
          </p>
        </div>
      )}

      {/* Synonyms */}
      {card.synonyms && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Từ đồng nghĩa</h4>
          <div className="flex flex-wrap gap-2">
            {card.synonyms.split(',').map((syn, idx) => (
              <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                {syn.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Antonyms */}
      {card.antonyms && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Từ trái nghĩa</h4>
          <div className="flex flex-wrap gap-2">
            {card.antonyms.split(',').map((ant, idx) => (
              <span key={idx} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                {ant.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Near Synonyms */}
      {card.nearSynonyms && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Từ gần đồng nghĩa</h4>
          <div className="flex flex-wrap gap-2">
            {card.nearSynonyms.split(',').map((near, idx) => (
              <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                {near.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="flex gap-2 pt-4 mt-4 border-t border-gray-200">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(card)}
              title="Xem chi tiết"
              className="flex-1 gap-2"
            >
              <Eye className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">Xem</span>
            </Button>
          )}
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(card)}
              title="Chỉnh sửa"
              className="flex-1 gap-2"
            >
              <Edit2 className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">Sửa</span>
            </Button>
          )}
          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (window.confirm(`Xác nhận xóa thẻ "${card.word}"?`)) {
                  onDelete(card.id);
                }
              }}
              title="Xóa"
              className="flex-1 gap-2"
            >
              <Trash2 className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">Xóa</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
