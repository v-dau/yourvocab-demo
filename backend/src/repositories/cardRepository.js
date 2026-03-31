import { pool } from '../config/db.js';

export const createCard = async (cardData, client = pool) => {
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

  const result = await client.query(query, values);
  return result.rows[0];
};

export const getCardsByUserId = async (filters, limit, offset) => {
  let selectClause = `
    SELECT 
      c.*,
      COALESCE(
        json_agg(
          json_build_object('id', t.id, 'tag_name', t.tag_name)
        ) FILTER (WHERE t.id IS NOT NULL), 
        '[]'
      ) as tags
    FROM public.cards c
    LEFT JOIN public.cards_tags ct ON c.id = ct.card_id
    LEFT JOIN public.tags t ON ct.tag_id = t.id
  `;
  let countQueryStr = `SELECT COUNT(DISTINCT c.id) FROM public.cards c WHERE c.user_id = $1 AND c.deleted_at IS NULL`;

  let whereClause = ` WHERE c.user_id = $1 AND c.deleted_at IS NULL`;
  const params = [filters.user_id];
  let paramIdx = 2;

  if (filters.search) {
    const searchLower = `%${filters.search.toLowerCase()}%`;
    whereClause += ` AND (LOWER(c.word) LIKE $${paramIdx} OR LOWER(c.meaning) LIKE $${paramIdx} OR LOWER(c.definition) LIKE $${paramIdx} OR LOWER(c.example) LIKE $${paramIdx})`;
    countQueryStr += ` AND (LOWER(c.word) LIKE $${paramIdx} OR LOWER(c.meaning) LIKE $${paramIdx} OR LOWER(c.definition) LIKE $${paramIdx} OR LOWER(c.example) LIKE $${paramIdx})`;
    params.push(searchLower);
    paramIdx++;
  }

  if (filters.levels) {
    const levelsArray = filters.levels.split(',');
    const levelParams = levelsArray.map((_, i) => `$${paramIdx + i}`).join(',');
    whereClause += ` AND c.level IN (${levelParams})`;
    countQueryStr += ` AND c.level IN (${levelParams})`;
    params.push(...levelsArray);
    paramIdx += levelsArray.length;
  }

  if (filters.popularity) {
    const popArray = filters.popularity.split(',').map(Number);
    const popParams = popArray.map((_, i) => `$${paramIdx + i}`).join(',');
    whereClause += ` AND c.popularity IN (${popParams})`;
    countQueryStr += ` AND c.popularity IN (${popParams})`;
    params.push(...popArray);
    paramIdx += popArray.length;
  }

  if (filters.partOfSpeech) {
    const posArray = filters.partOfSpeech.split(',');
    const posParams = posArray.map((_, i) => `$${paramIdx + i}`).join(',');
    whereClause += ` AND c.part_of_speech IN (${posParams})`;
    countQueryStr += ` AND c.part_of_speech IN (${posParams})`;
    params.push(...posArray);
    paramIdx += posArray.length;
  }

  if (filters.hasExample === 'true') {
    whereClause += ` AND c.example IS NOT NULL AND c.example != ''`;
    countQueryStr += ` AND c.example IS NOT NULL AND c.example != ''`;
  }

  let queryStr =
    selectClause +
    whereClause +
    ` GROUP BY c.id ORDER BY c.created_at DESC LIMIT $${paramIdx} OFFSET $${paramIdx + 1};`;

  const queryParams = [...params, limit, offset];

  const [result, countResult] = await Promise.all([
    pool.query(queryStr, queryParams),
    pool.query(countQueryStr, params),
  ]);

  return {
    data: result.rows,
    total: countResult.rows[0].count,
  };
};

export const getCardByIdAndUserId = async (id, user_id) => {
  const query = `
    SELECT 
      c.*,
      COALESCE(
        json_agg(
          json_build_object('id', t.id, 'tag_name', t.tag_name)
        ) FILTER (WHERE t.id IS NOT NULL), 
        '[]'
      ) as tags
    FROM public.cards c
    LEFT JOIN public.cards_tags ct ON c.id = ct.card_id
    LEFT JOIN public.tags t ON ct.tag_id = t.id
    WHERE c.id = $1 AND c.user_id = $2 AND c.deleted_at IS NULL
    GROUP BY c.id;
  `;
  const result = await pool.query(query, [id, user_id]);
  return result.rows[0];
};

export const updateCard = async (id, user_id, cardData, client = pool) => {
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

  const result = await client.query(query, values);
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
    SELECT 
      c.*,
      COALESCE(
        json_agg(
          json_build_object('id', t.id, 'tag_name', t.tag_name)
        ) FILTER (WHERE t.id IS NOT NULL), 
        '[]'
      ) as tags
    FROM public.cards c
    LEFT JOIN public.cards_tags ct ON c.id = ct.card_id
    LEFT JOIN public.tags t ON ct.tag_id = t.id
    WHERE c.user_id = $1 
      AND c.deleted_at IS NOT NULL 
      AND c.deleted_at > NOW() - INTERVAL '14 days'
    GROUP BY c.id
    ORDER BY c.deleted_at DESC;
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
