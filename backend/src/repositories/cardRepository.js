import { pool } from '../config/db.js';

export const createCard = async (cardData) => {
  const {
    word,
    part_of_speech,
    meaning,
    definition,
    ipa,
    example,
    level,
    popularity,
    synonyms,
    antonyms,
    near_synonyms,
    user_id,
  } = cardData;

  const query = `
    INSERT INTO public.cards (
      word, part_of_speech, meaning, definition, ipa, 
      example, level, popularity, synonyms, antonyms, near_synonyms, user_id
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
    ) RETURNING *;
  `;

  const values = [
    word,
    part_of_speech || null,
    meaning,
    definition || null,
    ipa || null,
    example || null,
    level || null,
    popularity || null,
    synonyms || null,
    antonyms || null,
    near_synonyms || null,
    user_id,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getCardsByUserId = async (user_id) => {
  const query = `
    SELECT * FROM public.cards 
    WHERE user_id = $1 AND deleted_at IS NULL
    ORDER BY created_at DESC;
  `;
  const result = await pool.query(query, [user_id]);
  return result.rows;
};

export const getCardByIdAndUserId = async (id, user_id) => {
  const query = `
    SELECT * FROM public.cards 
    WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL;
  `;
  const result = await pool.query(query, [id, user_id]);
  return result.rows[0];
};

export const updateCard = async (id, user_id, cardData) => {
  // Extract and filter valid fields to update
  const fields = [];
  const values = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(cardData)) {
    if (value !== undefined && key !== 'id' && key !== 'user_id' && key !== 'created_at') {
      fields.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  }

  if (fields.length === 0) return null;

  fields.push(`modified_at = NOW()`);

  // Add id and user_id to values
  values.push(id);
  values.push(user_id);

  const query = `
    UPDATE public.cards 
    SET ${fields.join(', ')}
    WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1} AND deleted_at IS NULL
    RETURNING *;
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteCard = async (id, user_id) => {
  // Soft delete implementation based on deleted_at column
  const query = `
    UPDATE public.cards
    SET deleted_at = NOW()
    WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
    RETURNING id;
  `;
  const result = await pool.query(query, [id, user_id]);
  return result.rowCount > 0;
};

export const getDeletedCardsByUserId = async (user_id) => {
  const query = `
    SELECT * FROM public.cards 
    WHERE user_id = $1 
      AND deleted_at IS NOT NULL 
      AND deleted_at > NOW() - INTERVAL '14 days'
    ORDER BY deleted_at DESC;
  `;
  const result = await pool.query(query, [user_id]);
  return result.rows;
};

export const restoreCard = async (id, user_id) => {
  const query = `
    UPDATE public.cards
    SET deleted_at = NULL
    WHERE id = $1 AND user_id = $2 AND deleted_at IS NOT NULL
    RETURNING id;
  `;
  const result = await pool.query(query, [id, user_id]);
  return result.rowCount > 0;
};

export const hardDeleteCard = async (id, user_id) => {
  const query = `
    DELETE FROM public.cards
    WHERE id = $1 AND user_id = $2 AND deleted_at IS NOT NULL
    RETURNING id;
  `;
  const result = await pool.query(query, [id, user_id]);
  return result.rowCount > 0;
};

export const restoreAllCards = async (user_id) => {
  const query = `
    UPDATE public.cards
    SET deleted_at = NULL
    WHERE user_id = $1 AND deleted_at IS NOT NULL AND deleted_at > NOW() - INTERVAL '14 days'
    RETURNING id;
  `;
  const result = await pool.query(query, [user_id]);
  return result.rowCount;
};

export const emptyTrash = async (user_id) => {
  const query = `
    DELETE FROM public.cards
    WHERE user_id = $1 AND deleted_at IS NOT NULL
    RETURNING id;
  `;
  const result = await pool.query(query, [user_id]);
  return result.rowCount;
};
