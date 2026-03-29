import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CardSearchBarProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

export const CardSearchBar: React.FC<CardSearchBarProps> = ({ onSearch, searchQuery }) => {
  const { t } = useTranslation();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleClear = () => {
    onSearch('');
  };

  return (
    <div className="flex gap-2 items-center">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder={t('cards_page.search_placeholder')}
          className="pl-8"
          value={searchQuery}
          onChange={handleChange}
        />
      </div>
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClear}
          title={t('cards_page.clear_search')}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
