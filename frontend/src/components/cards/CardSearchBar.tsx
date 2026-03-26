import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface CardSearchBarProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

export const CardSearchBar: React.FC<CardSearchBarProps> = ({
  onSearch,
  searchQuery,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleClear = () => {
    onSearch("");
  };

  return (
    <div className="flex gap-2 items-center">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Tìm kiếm theo từ vựng, nghĩa..."
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
          title="Xóa tìm kiếm"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
