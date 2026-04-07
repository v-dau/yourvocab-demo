import { pool } from '../config/db.js';

export const createFeedback = async (userId, title, content) => {
  const query = `
    INSERT INTO feedbacks (user_id, title, content)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [userId, title, content];
  const res = await pool.query(query, values);
  return res.rows[0];
};

export const getFeedbacksByUserId = async (userId) => {
  const query = `
    SELECT id, title, content, is_read, created_at, img_urls
    FROM feedbacks
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;
  const res = await pool.query(query, [userId]);
  return res.rows;
};
