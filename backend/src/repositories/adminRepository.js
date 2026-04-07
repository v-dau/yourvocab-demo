import { pool } from '../config/db.js';

export const getGlobalStats = async () => {
  const [
    totalUsersRes,
    newUsersRes,
    totalCardsRes,
    totalCompletedCardsRes,
    totalPracticeSentencesRes,
    totalTagsRes,
    totalAiUsageRes,
  ] = await Promise.all([
    pool.query('SELECT COUNT(*) AS total_users FROM users'),
    pool.query(
      "SELECT COUNT(*) AS new_users FROM users WHERE created_at >= NOW() - INTERVAL '3 days'"
    ),
    pool.query('SELECT COUNT(*) AS total_cards FROM cards'),
    pool.query(
      'SELECT COUNT(*) AS total_completed FROM card_review_trackers WHERE is_completed = true'
    ),
    pool.query('SELECT COUNT(*) AS total_practice FROM practice_sentences'),
    pool.query('SELECT COUNT(*) AS total_tags FROM tags'),
    pool.query('SELECT SUM(total_generations) AS total_ai FROM user_ai_usages'),
  ]);

  return {
    totalUsers: parseInt(totalUsersRes.rows[0].total_users || 0),
    newUsers: parseInt(newUsersRes.rows[0].new_users || 0),
    totalCards: parseInt(totalCardsRes.rows[0].total_cards || 0),
    totalCompletedCards: parseInt(totalCompletedCardsRes.rows[0].total_completed || 0),
    totalPracticeSentences: parseInt(totalPracticeSentencesRes.rows[0].total_practice || 0),
    totalTags: parseInt(totalTagsRes.rows[0].total_tags || 0),
    totalAiUsage: parseInt(totalAiUsageRes.rows[0].total_ai || 0),
  };
};
