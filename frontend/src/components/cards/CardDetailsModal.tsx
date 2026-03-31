import React from 'react';
import { Card as CardUI } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PopularityBadge } from './PopularityBadge';
import type { Card } from '@/types/card';
import { X, Volume2 } from 'lucide-react';

interface CardDetailsModalProps {
  card: Card | null;
  onClose: () => void;
}

export const CardDetailsModal: React.FC<CardDetailsModalProps> = ({ card, onClose }) => {
  if (!card) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <CardUI className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-primary mb-2">{card.word}</h2>
              <p
                className={`text-sm italic ${card.partOfSpeech ? 'text-muted-foreground' : 'text-gray-600 dark:text-gray-300'}`}
              >
                {card.partOfSpeech || 'N/A'}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Main Info */}
          <div className="space-y-6 border-b pb-6 mb-6">
            {/* Word info badges */}
            <div className="flex flex-wrap gap-3">
              {card.level && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full font-medium">
                  Má»©c {card.level}
                </span>
              )}
              <PopularityBadge popularity={card.popularity} />
            </div>

            {/* IPA */}
            <div>
              <h3 className="font-semibold mb-2">Phát âm</h3>
              <div className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-muted-foreground" />
                {card.ipa && <p className="text-lg font-medium">/{card.ipa}/</p>}
              </div>
            </div>

            {/* Meaning */}
            <div>
              <h3 className="font-semibold mb-2">NghÄ©a</h3>
              <p className="text-base">{card.meaning}</p>
            </div>

            {/* Definition */}
            {card.definition && (
              <div>
                <h3 className="font-semibold mb-2">Äá»‹nh nghÄ©a</h3>
                <p className="text-sm text-muted-foreground">{card.definition}</p>
              </div>
            )}

            {/* Example */}
            {card.example && (
              <div>
                <h3 className="font-semibold mb-2">VÃ­ dá»¥</h3>
                <p className="text-sm italic bg-muted p-3 rounded-lg border-l-4 border-primary">
                  "{card.example}"
                </p>
              </div>
            )}
          </div>

          {/* Synonyms/Antonyms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {card.synonyms && (
              <div>
                <h3 className="font-semibold mb-2">Tá»« Ä‘á»“ng nghÄ©a</h3>
                <div className="flex flex-wrap gap-2">
                  {card.synonyms.split(',').map((syn, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-sm rounded"
                    >
                      {syn.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {card.antonyms && (
              <div>
                <h3 className="font-semibold mb-2">Tá»« trÃ¡i nghÄ©a</h3>
                <div className="flex flex-wrap gap-2">
                  {card.antonyms.split(',').map((ant, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 text-sm rounded"
                    >
                      {ant.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {card.nearSynonyms && (
              <div>
                <h3 className="font-semibold mb-2">Tá»« gáº§n Ä‘á»“ng nghÄ©a</h3>
                <div className="flex flex-wrap gap-2">
                  {card.nearSynonyms.split(',').map((near, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 text-sm rounded"
                    >
                      {near.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {card.tags.map((tag) => {
                const currentTag = tag as { id: string; tagName?: string; tag_name?: string };
                const tagNameStr = (
                  currentTag.tagName ||
                  currentTag.tag_name ||
                  'tag'
                ).toLowerCase();
                return (
                  <span
                    key={tag.id}
                    className="bg-secondary text-secondary-foreground rounded-sm px-1.5 py-0.5 text-xs inline-flex items-center"
                  >
                    #{tagNameStr}
                  </span>
                );
              })}
            </div>
          )}

          {/* Metadata */}
          <div className="text-xs text-muted-foreground space-y-1 pb-6 border-b">
            <p>
              <span className="font-medium">Táº¡o lÃºc:</span>{' '}
              {new Date(card.createdAt).toLocaleString('vi-VN')}
            </p>
            <p>
              <span className="font-medium">Cáº­p nháº­t:</span>{' '}
              {new Date(card.modifiedAt).toLocaleString('vi-VN')}
            </p>
          </div>

          {/* Close Button */}
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>
              ÄÃ³ng
            </Button>
          </div>
        </div>
      </CardUI>
    </div>
  );
};
