import { pool } from '../config/db.js';

export const getSentencesByCardId = async (cardId, userId) => {
  const query = `
    SELECT ps.* 
    FROM practice_sentences ps
    JOIN cards c ON ps.card_id = c.id
    WHERE ps.card_id = $1 AND c.user_id = $2 AND c.deleted_at IS NULL
    ORDER BY ps.created_at ASC
  `;
  const result = await pool.query(query, [cardId, userId]);
  return result.rows;
};

export const createSentence = async (cardId, userId, content) => {
  const checkOwnerQuery = `
    SELECT id FROM cards WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
  `;
  const checkResult = await pool.query(checkOwnerQuery, [cardId, userId]);
  if (checkResult.rows.length === 0) {
    throw new Error('CARD_NOT_FOUND_OR_UNAUTHORIZED');
  }

  const insertQuery = `
    INSERT INTO practice_sentences (card_id, content)
    VALUES ($1, $2)
    RETURNING *
  `;
  const result = await pool.query(insertQuery, [cardId, content]);
  return result.rows[0];
};

export const updateSentence = async (sentenceId, userId, content) => {
  const query = `
    UPDATE practice_sentences ps
    SET content = $1, modified_at = NOW()
    FROM cards c
    WHERE ps.card_id = c.id AND ps.id = $2 AND c.user_id = $3 AND c.deleted_at IS NULL
    RETURNING ps.*
  `;
  const result = await pool.query(query, [content, sentenceId, userId]);
  if (result.rows.length === 0) {
    throw new Error('SENTENCE_NOT_FOUND_OR_UNAUTHORIZED');
  }
  return result.rows[0];
};

export const deleteSentence = async (sentenceId, userId) => {
  const query = `
    DELETE FROM practice_sentences ps
    USING cards c
    WHERE ps.card_id = c.id AND ps.id = $1 AND c.user_id = $2 AND c.deleted_at IS NULL
    RETURNING ps.id
  `;
  const result = await pool.query(query, [sentenceId, userId]);
  if (result.rows.length === 0) {
    throw new Error('SENTENCE_NOT_FOUND_OR_UNAUTHORIZED');
  }
  return result.rows[0];
};
