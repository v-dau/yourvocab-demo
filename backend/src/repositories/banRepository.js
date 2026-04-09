import { pool, query } from '../config/db.js';

export const getActiveBan = async (userId) => {
  const result = await query(
    `SELECT * FROM ban_histories WHERE user_id = $1 AND status = 1 ORDER BY created_at DESC LIMIT 1`,
    [userId]
  );
  return result.rows[0];
};

export const updateBanStatus = async (banId, status) => {
  await query(`UPDATE ban_histories SET status = $1, modified_at = NOW() WHERE id = $2`, [
    status,
    banId,
  ]);
};

export const revokeAllActiveBans = async (userId, clientParam = null) => {
  const client = clientParam || pool;
  await client.query(
    `UPDATE ban_histories SET status = 3, modified_at = NOW() WHERE user_id = $1 AND status = 1`,
    [userId]
  );
};

export const createBan = async (userId, reason, duration, clientParam = null) => {
  const client = clientParam || pool;
  const result = await client.query(
    `INSERT INTO ban_histories (user_id, reason, duration, status, created_at, modified_at)
     VALUES ($1, $2, $3, 1, NOW(), NOW()) RETURNING *`,
    [userId, reason, duration]
  );
  return result.rows[0];
};
