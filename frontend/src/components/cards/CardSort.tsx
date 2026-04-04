import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface CardSortState {
  sortBy: 'created_at' | 'word';
  sortOrder: 'desc' | 'asc';
}

interface CardSortProps {
  currentSort: CardSortState;
  onSortChange: (sort: CardSortState) => void;
}

export const CardSort: React.FC<CardSortProps> = ({ currentSort, onSortChange }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const options = [
    {
      value: { sortBy: 'created_at', sortOrder: 'desc' },
      label: t('cards_page.filters.sort_newest'),
    },
    {
      value: { sortBy: 'created_at', sortOrder: 'asc' },
      label: t('cards_page.filters.sort_oldest'),
    },
    { value: { sortBy: 'word', sortOrder: 'asc' }, label: t('cards_page.filters.sort_az') },
    { value: { sortBy: 'word', sortOrder: 'desc' }, label: t('cards_page.filters.sort_za') },
  ] as const;

  const handleSelect = (sortBy: 'created_at' | 'word', sortOrder: 'desc' | 'asc') => {
    onSortChange({ sortBy, sortOrder });
    setIsOpen(false);
  };

  const isSelected = (sortBy: string, sortOrder: string) => {
    return currentSort.sortBy === sortBy && currentSort.sortOrder === sortOrder;
  };

  const selectedOption = options.find((o) => isSelected(o.value.sortBy, o.value.sortOrder));

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="gap-2">
        <ArrowUpDown className="h-4 w-4" />
        <span className="hidden sm:inline">
          {t('cards_page.filters.sort_btn')}
          {selectedOption ? ` (${selectedOption.label})` : ''}
        </span>
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-1 z-50">
          {options.map((option, idx) => (
            <button
              key={idx}
              className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-muted transition-colors ${
                isSelected(option.value.sortBy, option.value.sortOrder)
                  ? 'text-primary font-medium bg-muted/50'
                  : ''
              }`}
              onClick={() => handleSelect(option.value.sortBy, option.value.sortOrder)}
            >
              {option.label}
              {isSelected(option.value.sortBy, option.value.sortOrder) && (
                <Check className="h-4 w-4" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
