// Card level types (A1-C2 CEFR levels)
export type CardLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

// Popularity rating (0-5)
// 0 = N/A (not set, white with black font)
// 1 = Extremely rare (red)
// 2 = Rare (orange)
// 3 = Uncommon (yellow)
// 4 = Common (green)
// 5 = Essentials (blue)
export type CardPopularity = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Full Card object from database
 */
export interface Card {
  id: string; // UUID
  word: string;
  partOfSpeech?: string; // e.g., "noun", "verb", "adjective"
  meaning: string; // Required meaning
  definition?: string; // Optional detailed definition
  ipa?: string; // International Phonetic Alphabet
  example?: string; // Example sentence/usage
  level?: CardLevel; // CEFR level (A1-C2)
  popularity?: CardPopularity; // Rating 1-5
  synonyms?: string; // JSON or comma-separated
  antonyms?: string; // JSON or comma-separated
  nearSynonyms?: string; // JSON or comma-separated
  userId: string; // UUID of card creator
  createdAt: string | Date; // ISO 8601 timestamp
  modifiedAt: string | Date; // ISO 8601 timestamp
  deletedAt?: string | Date | null; // For soft delete
  tags?: { id: string; tagName?: string }[];
  isCompleted?: boolean;
}

/**
 * Input for creating a new card
 */
export interface CreateCardInput {
  word: string;
  meaning: string;
  partOfSpeech?: string;
  definition?: string;
  ipa?: string;
  example?: string;
  level?: CardLevel;
  popularity?: CardPopularity;
  synonyms?: string;
  antonyms?: string;
  nearSynonyms?: string;
  tags?: string[];
}

/**
 * Input for updating a card
 */
export interface UpdateCardInput {
  word?: string;
  meaning?: string;
  partOfSpeech?: string;
  definition?: string;
  ipa?: string;
  example?: string;
  level?: CardLevel;
  popularity?: CardPopularity;
  synonyms?: string;
  antonyms?: string;
  nearSynonyms?: string;
  tags?: string[];
}

/**
 * Card with review tracker information
 */
export interface CardWithReview extends Card {
  reviewTracker?: {
    stepIndex: number; // 0-5
    nextReviewDate: string | Date;
    isCompleted: boolean;
  };
}
