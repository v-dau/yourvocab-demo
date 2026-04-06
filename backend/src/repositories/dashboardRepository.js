import { query } from '../config/db.js';

export const getUserStats = async (userId) => {
  const totalCardsPromise = query(
    'SELECT COUNT(id) AS count FROM cards WHERE user_id = $1 AND deleted_at IS NULL',
    [userId]
  );

  const reviewStatsPromise = query(
    `SELECT cr.is_completed, COUNT(cr.card_id) AS count
     FROM card_review_trackers cr
     JOIN cards c ON cr.card_id = c.id
     WHERE c.user_id = $1 AND c.deleted_at IS NULL
     GROUP BY cr.is_completed`,
    [userId]
  );

  const cardsByPartOfSpeechPromise = query(
    `SELECT part_of_speech AS name, COUNT(id) AS value
     FROM cards
     WHERE user_id = $1 AND deleted_at IS NULL
     GROUP BY part_of_speech`,
    [userId]
  );

  const cardsByLevelPromise = query(
    `SELECT level AS name, COUNT(id) AS value
     FROM cards
     WHERE user_id = $1 AND deleted_at IS NULL
     GROUP BY level`,
    [userId]
  );

  const practiceStatsPromise = query(
    `SELECT COUNT(p.id) AS total_sentences, COUNT(DISTINCT p.card_id) AS total_cards_practiced
     FROM practice_sentences p
     JOIN cards c ON p.card_id = c.id
     WHERE c.user_id = $1 AND c.deleted_at IS NULL`,
    [userId]
  );

  const aiUsagePromise = query('SELECT total_generations FROM user_ai_usages WHERE user_id = $1', [
    userId,
  ]);

  const totalTagsPromise = query('SELECT COUNT(id) AS count FROM tags WHERE user_id = $1', [
    userId,
  ]);

  const [
    totalCardsResult,
    reviewStatsResult,
    cardsByPosResult,
    cardsByLevelResult,
    practiceStatsResult,
    aiUsageResult,
    totalTagsResult,
  ] = await Promise.all([
    totalCardsPromise,
    reviewStatsPromise,
    cardsByPartOfSpeechPromise,
    cardsByLevelPromise,
    practiceStatsPromise,
    aiUsagePromise,
    totalTagsPromise,
  ]);

  return {
    totalCards: parseInt(totalCardsResult.rows[0]?.count || 0, 10),
    reviewStats: reviewStatsResult.rows,
    cardsByPartOfSpeech: cardsByPosResult.rows,
    cardsByLevel: cardsByLevelResult.rows,
    practiceStats: practiceStatsResult.rows[0],
    aiUsage: aiUsageResult.rows[0]?.total_generations || 0,
    totalTags: parseInt(totalTagsResult.rows[0]?.count || 0, 10),
  };
};
