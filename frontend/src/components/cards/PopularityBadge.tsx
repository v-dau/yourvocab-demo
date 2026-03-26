import React from 'react';

interface PopularityBadgeProps {
  popularity?: number | null;
  className?: string;
}

// Màu sắc và nhãn cho từng mức độ phổ biến
const POPULARITY_CONFIG = {
  0: {
    label: 'N/A',
    bgColor: 'bg-gray-200',
    textColor: 'text-gray-900',
    borderColor: 'border-gray-300',
    icon: '-',
  },
  1: {
    label: 'Extremely rare',
    bgColor: 'bg-red-500',
    textColor: 'text-white',
    borderColor: 'border-red-600',
    icon: '★',
  },
  2: {
    label: 'Rare',
    bgColor: 'bg-orange-500',
    textColor: 'text-white',
    borderColor: 'border-orange-600',
    icon: '★',
  },
  3: {
    label: 'Uncommon',
    bgColor: 'bg-yellow-400',
    textColor: 'text-gray-900',
    borderColor: 'border-yellow-500',
    icon: '★',
  },
  4: {
    label: 'Common',
    bgColor: 'bg-green-500',
    textColor: 'text-white',
    borderColor: 'border-green-600',
    icon: '★',
  },
  5: {
    label: 'Essentials',
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    borderColor: 'border-blue-600',
    icon: '★',
  },
} as const;

export const PopularityBadge: React.FC<PopularityBadgeProps> = ({
  popularity = 0,
  className = '',
}) => {
  const popularityValue = popularity ?? 0;
  const config =
    POPULARITY_CONFIG[popularityValue as keyof typeof POPULARITY_CONFIG] || POPULARITY_CONFIG[0];

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium
        border-2 ${config.bgColor} ${config.textColor} ${config.borderColor}
        ${className}
      `}
    >
      {popularityValue !== 0 && <span className="text-lg">{config.icon}</span>}
      <span>{config.label}</span>
    </div>
  );
};
