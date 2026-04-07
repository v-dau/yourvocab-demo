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
    pool.query("SELECT COUNT(*) AS total_users FROM users WHERE role = 'user'"),
    pool.query(
      "SELECT COUNT(*) AS new_users FROM users WHERE role = 'user' AND created_at >= NOW() - INTERVAL '3 days'"
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

export const getUsersWithStats = async (
  page = 1,
  limit = 10,
  search = '',
  sortBy = 'newest',
  filterBanned = false
) => {
  const offset = (page - 1) * limit;
  let filters = ["role = 'user'"];
  const values = [];
  let paramIndex = 1;

  if (search) {
    filters.push(`username ILIKE $${paramIndex}`);
    values.push(`%${search}%`);
    paramIndex++;
  }

  if (filterBanned) {
    filters.push(`is_banned = true`);
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

  let orderBy = 'u.created_at DESC';
  switch (sortBy) {
    case 'oldest':
      orderBy = 'u.created_at ASC';
      break;
    case 'a-z':
      orderBy = 'u.username ASC';
      break;
    case 'z-a':
      orderBy = 'u.username DESC';
      break;
    case 'most_cards':
      orderBy = 'total_cards DESC, u.created_at DESC';
      break;
    case 'least_cards':
      orderBy = 'total_cards ASC, u.created_at DESC';
      break;
    case 'newest':
    default:
      orderBy = 'u.created_at DESC';
      break;
  }

  // Correlated subqueries are optimized by PostgreSQL for limits,
  // avoiding a massive JOIN + GROUP BY over the whole DB.
  const query = `
    SELECT 
      u.id, 
      u.username, 
      u.email, 
      u.is_banned,
      u.avatar_url,
      u.created_at,
      (SELECT COUNT(*) FROM cards c WHERE c.user_id = u.id)::int AS total_cards,
      (SELECT COUNT(*) FROM card_review_trackers cr 
       JOIN cards c ON cr.card_id = c.id 
       WHERE c.user_id = u.id AND cr.is_completed = true)::int AS completed_cards,
      (SELECT COUNT(*) FROM practice_sentences ps 
       JOIN cards c ON ps.card_id = c.id 
       WHERE c.user_id = u.id)::int AS total_sentences,
      (SELECT COUNT(*) FROM tags t WHERE t.user_id = u.id)::int AS total_tags,
      COALESCE((SELECT total_generations FROM user_ai_usages uau WHERE uau.user_id = u.id), 0)::int AS total_ai_usages
    FROM users u
    ${whereClause}
    ORDER BY ${orderBy}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  const countQuery = `
    SELECT COUNT(*) 
    FROM users u
    ${whereClause}
  `;

  values.push(limit, offset);

  const [dataRes, countRes] = await Promise.all([
    pool.query(query, values),
    pool.query(countQuery, values.slice(0, paramIndex - 1)),
  ]);

  return {
    users: dataRes.rows,
    totalCount: parseInt(countRes.rows[0].count, 10),
  };
};
