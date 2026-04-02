import { pool } from '../config/db.js';

class ReviewRepository {
  async getDueReviewCards(userId, now = new Date()) {
    const query = `
      SELECT
        c.id, c.word, c.part_of_speech, c.meaning, c.definition, c.ipa, c.example, c.level, c.popularity, c.synonyms, c.antonyms, c.near_synonyms,
        crt.step_index,
        crt.next_review_date,
        COALESCE(
          json_agg(
            json_build_object('id', t.id, 'tagName', t.tag_name)
          ) FILTER (WHERE t.id IS NOT NULL), '[]'::json
        ) as tags
      FROM cards c
      JOIN card_review_trackers crt ON c.id = crt.card_id
      LEFT JOIN cards_tags ct ON c.id = ct.card_id
      LEFT JOIN tags t ON ct.tag_id = t.id
      WHERE c.user_id = $1
        AND c.deleted_at IS NULL
        AND crt.is_completed = false
        AND crt.next_review_date <= $2
      GROUP BY c.id, crt.step_index, crt.next_review_date
      ORDER BY crt.step_index ASC, crt.next_review_date ASC
    `;
    const { rows } = await pool.query(query, [userId, now]);
    return rows;
  }

  async getReviewTracker(cardId, userId) {
    const query = `
      SELECT crt.* 
      FROM card_review_trackers crt
      JOIN cards c ON crt.card_id = c.id
      WHERE c.id = $1 AND c.user_id = $2 AND c.deleted_at IS NULL
    `;
    const { rows } = await pool.query(query, [cardId, userId]);
    return rows[0];
  }

  async updateReviewTracker(cardId, stepIndex, nextReviewDate, isCompleted) {
    const query = `
      UPDATE card_review_trackers
      SET step_index = $2, next_review_date = $3, is_completed = $4, modified_at = NOW()
      WHERE card_id = $1
      RETURNING *
    `;
    const { rows } = await pool.query(query, [cardId, stepIndex, nextReviewDate, isCompleted]);
    return rows[0];
  }
}

export default new ReviewRepository();
