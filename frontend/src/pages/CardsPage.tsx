import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardSearchBar, CardFilters, CardListView, CardDetailsModal } from '@/components/cards';
import type { Card } from '@/types/card';
import type { CardFiltersState } from '@/components/cards/CardFilters';
import { useCardFilter, useCardOperations } from '@/hooks';
import { Plus } from 'lucide-react';

// Mock data - thay thế bằng API call thực tế
const MOCK_CARDS: Card[] = [
  {
    id: '1',
    word: 'Serendipity',
    meaning: 'Tìm thấy điều tốt đẹp một cách tình cờ',
    partOfSpeech: 'Noun',
    definition: 'The occurrence of events by chance in a happy or beneficial way',
    ipa: 'ˌserənˈdɪpəti',
    example: 'It was pure serendipity that we met each other at the same café.',
    level: 'C1',
    popularity: 4,
    synonyms: 'luck, chance, fortune',
    antonyms: 'misfortune, bad luck',
    nearSynonyms: 'fortuitous circumstance',
    userId: 'user-1',
    createdAt: new Date('2024-01-15'),
    modifiedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    word: 'Eloquent',
    meaning: 'Lưu loát, thành thạo trong cách nói',
    partOfSpeech: 'Adjective',
    definition: 'Fluent or persuasive in speaking or writing',
    ipa: 'ˈɛləkwənt',
    example: 'The eloquent speaker captivated the entire audience.',
    level: 'B2',
    popularity: 3,
    synonyms: 'articulate, fluent, expressive',
    antonyms: 'inarticulate, hesitant',
    userId: 'user-1',
    createdAt: new Date('2024-01-10'),
    modifiedAt: new Date('2024-01-18'),
  },
  {
    id: '3',
    word: 'Ephemeral',
    meaning: 'Tồn tại một thời gian rất ngắn',
    partOfSpeech: 'Adjective',
    definition: 'Lasting for a very short time',
    ipa: 'ɪˈfɛmərəl',
    example: 'The beauty of cherry blossoms is ephemeral, lasting only a few weeks.',
    level: 'C2',
    popularity: 5,
    synonyms: 'fleeting, transient, short-lived',
    antonyms: 'permanent, eternal',
    nearSynonyms: 'momentary, brief',
    userId: 'user-1',
    createdAt: new Date('2024-01-05'),
    modifiedAt: new Date('2024-01-19'),
  },
  {
    id: '4',
    word: 'Pragmatic',
    meaning: 'Thực tế, dựa vào thực tế hơn lý tưởng',
    partOfSpeech: 'Adjective',
    definition:
      'Dealing with things in a way that is based on practical rather than theoretical considerations',
    ipa: 'præɡˈmætɪk',
    example: 'We need to take a pragmatic approach to solving this problem.',
    level: 'B1',
    popularity: 4,
    synonyms: 'practical, realistic, sensible',
    antonyms: 'idealistic, impractical',
    userId: 'user-1',
    createdAt: new Date('2024-01-08'),
    modifiedAt: new Date('2024-01-17'),
  },
  {
    id: '5',
    word: 'Ubiquitous',
    meaning: 'Có mặt khắp nơi, phổ biến rộng rãi',
    partOfSpeech: 'Adjective',
    definition: 'Present, appearing, or found everywhere',
    ipa: 'juːˈbɪkwɪtəs',
    example: 'Smartphones have become ubiquitous in modern society.',
    level: 'C1',
    popularity: 3,
    synonyms: 'omnipresent, pervasive, widespread',
    antonyms: 'rare, scarce',
    userId: 'user-1',
    createdAt: new Date('2024-01-12'),
    modifiedAt: new Date('2024-01-16'),
  },
  {
    id: '6',
    word: 'Meticulous',
    meaning: 'Rất cẩn thận, tỉ mỉ trong chi tiết',
    partOfSpeech: 'Adjective',
    definition: 'Showing great attention to detail; very careful and precise',
    ipa: 'məˈtɪkjələs',
    example: 'The architect was meticulous in reviewing every aspect of the design.',
    level: 'B2',
    popularity: 3,
    synonyms: 'careful, precise, scrupulous',
    antonyms: 'careless, sloppy',
    nearSynonyms: 'fastidious, punctilious',
    userId: 'user-1',
    createdAt: new Date('2024-01-09'),
    modifiedAt: new Date('2024-01-15'),
  },
  {
    id: '7',
    word: 'Benevolent',
    meaning: 'Tốt bụng, vị tha',
    partOfSpeech: 'Adjective',
    definition: 'Kind and generous; showing kindly feelings or benevolence',
    ipa: 'bəˈnɛvələnt',
    example: 'The benevolent organization donates millions to charity every year.',
    level: 'A2',
    popularity: 2,
    synonyms: 'kind, generous, caring',
    antonyms: 'malevolent, cruel',
    userId: 'user-1',
    createdAt: new Date('2024-01-07'),
    modifiedAt: new Date('2024-01-14'),
  },
  {
    id: '8',
    word: 'Ambiguous',
    meaning: 'Không rõ ràng, có thể hiểu theo nhiều cách',
    partOfSpeech: 'Adjective',
    definition: 'Open to more than one interpretation; unclear in meaning',
    ipa: 'æmˈbɪɡjuəs',
    example: 'The statement was ambiguous and could be interpreted in different ways.',
    level: 'B1',
    popularity: 4,
    synonyms: 'unclear, vague, equivocal',
    antonyms: 'clear, unambiguous',
    userId: 'user-1',
    createdAt: new Date('2024-01-11'),
    modifiedAt: new Date('2024-01-13'),
  },
];

const CardsPage = () => {
  const { cards, deleteCard } = useCardOperations(MOCK_CARDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<CardFiltersState>({
    levels: [],
    popularity: [],
    partOfSpeech: [],
    hasExample: null,
  });
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  // Use hook để filter danh sách thẻ
  const filteredCards = useCardFilter({
    cards,
    searchQuery,
    filters,
  });

  // CRUD Operations
  const handleCreate = () => {
    alert('Chuyển đến trang tạo thẻ mới');
    // Chuyển hướng đến CreateEditCardPage
    // navigate('/cards/create');
  };

  const handleEdit = (card: Card) => {
    alert(`Chỉnh sửa thẻ: ${card.word}`);
    // navigate(`/cards/edit/${card.id}`);
  };

  const handleDelete = (cardId: string) => {
    deleteCard(cardId);
    alert('Thẻ đã được xóa');
  };

  const handleView = (card: Card) => {
    setSelectedCard(card);
  };

  return (
    <div className="min-h-screen bg-background p-6 bg-gradient-blue">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Danh sách thẻ</h1>
              <p className="text-muted-foreground mt-1">
                Quản lý {filteredCards.length} thẻ từ vựng
              </p>
            </div>
            <Button onClick={handleCreate} className="gap-2 h-10 px-4">
              <Plus className="h-5 w-5" />
              <span>Thêm thẻ mới</span>
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <CardSearchBar searchQuery={searchQuery} onSearch={setSearchQuery} />
          </div>
          <CardFilters onFilterChange={setFilters} />
        </div>

        {/* Results Info */}
        <div className="mb-4 text-sm text-muted-foreground">
          Hiển thị {filteredCards.length} trên {cards.length} thẻ
          {searchQuery && ` (tìm kiếm: "${searchQuery}")`}
        </div>

        {/* Cards Grid */}
        <CardListView
          cards={filteredCards}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />

        {/* Card Details Modal */}
        <CardDetailsModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      </div>
    </div>
  );
};

export default CardsPage;
