import React from 'react';
import { Card } from '@/components/cards';
import type { Card as CardType } from '@/types/card';

export const CardPreview: React.FC = () => {
  const exampleCard: CardType = {
    id: '1',
    word: 'Ephemeral',
    meaning: 'Tạm thời, chóc tức',
    partOfSpeech: 'noun, adjective',
    definition: 'Lasting only a very short time; not permanent',
    ipa: 'ɪˈfem(ə)rəl',
    example: 'The beauty of cherry blossoms is ephemeral, lasting only a few weeks.',
    level: 'C1',
    popularity: 4,
    synonyms: 'fleeting, transient, momentary',
    antonyms: 'permanent, eternal, lasting',
    nearSynonyms: 'temporary, brief, short-lived',
    userId: 'user-123',
    createdAt: new Date(),
    modifiedAt: new Date(),
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Card Component Preview</h1>
        <Card
          card={exampleCard}
          onAddMeaning={() => console.log('Add meaning clicked')}
          isSelected={false}
        />
      </div>
    </div>
  );
};
