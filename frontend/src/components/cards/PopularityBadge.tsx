import React from 'react';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

interface PopularityBadgeProps {
  popularity?: number | null;
  className?: string;
}

const getPopularityConfig = (t: TFunction) => ({
  0: {
    label: t('card.popularity.na', 'N/A'),
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    textColor: 'text-gray-600 dark:text-gray-300',
    borderColor: 'border-transparent',
    iconColor: 'text-gray-400',
  },
  1: {
    label: t('card.popularity.extremely_rare', 'Extremely rare'),
    bgColor: 'bg-red-50 dark:bg-red-900/30',
    textColor: 'text-red-700 dark:text-red-300',
    borderColor: 'border-red-200 dark:border-red-800',
    iconColor: 'text-red-500',
  },
  2: {
    label: t('card.popularity.rare', 'Rare'),
    bgColor: 'bg-orange-50 dark:bg-orange-900/30',
    textColor: 'text-orange-700 dark:text-orange-300',
    borderColor: 'border-orange-200 dark:border-orange-800',
    iconColor: 'text-orange-500',
  },
  3: {
    label: t('card.popularity.uncommon', 'Uncommon'),
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
    textColor: 'text-yellow-700 dark:text-yellow-300',
    borderColor: 'border-yellow-300 dark:border-yellow-800',
    iconColor: 'text-yellow-500',
  },
  4: {
    label: t('card.popularity.common', 'Common'),
    bgColor: 'bg-green-50 dark:bg-green-900/30',
    textColor: 'text-green-700 dark:text-green-300',
    borderColor: 'border-green-200 dark:border-green-800',
    iconColor: 'text-green-500',
  },
  5: {
    label: t('card.popularity.essentials', 'Essentials'),
    bgColor: 'bg-blue-50 dark:bg-blue-900/30',
    textColor: 'text-blue-700 dark:text-blue-300',
    borderColor: 'border-blue-200 dark:border-blue-800',
    iconColor: 'text-blue-500',
  },
});

export const PopularityBadge: React.FC<PopularityBadgeProps> = ({
  popularity = 0,
  className = '',
}) => {
  const { t } = useTranslation();
  const POPULARITY_CONFIG = getPopularityConfig(t);

  const popularityValue = popularity ?? 0;
  const config =
    POPULARITY_CONFIG[popularityValue as keyof typeof POPULARITY_CONFIG] || POPULARITY_CONFIG[0];

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {popularityValue === 0 ? (
          <Star className={`h-4 w-4 ${config.iconColor}`} />
        ) : (
          <>
            <Star className={`h-4 w-4 ${config.iconColor}`} fill="currentColor" strokeWidth={1} />
            <span className="absolute text-[10px] font-bold leading-none text-white pt-[1px]">
              {popularityValue}
            </span>
          </>
        )}
      </div>
      <span>{config.label}</span>
    </div>
  );
};
