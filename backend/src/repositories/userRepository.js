import { query, pool } from '../config/db.js';

// find user by username
export const findByUsername = async (username) => {
  const text = 'SELECT * FROM users WHERE username = $1';
  const result = await query(text, [username]);
  return result.rows[0]; // returns undefined if not found
};

// find user by email
export const findByEmail = async (email) => {
  const text = 'SELECT * FROM users WHERE email = $1';
  const result = await query(text, [email]);
  return result.rows[0]; // returns undefined if not found
};

// create new user
export const create = async (username, email, passwordHash, language = 'en', theme = 'system') => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const text = `
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at;
    `;
    const result = await client.query(text, [username, email, passwordHash]);
    const newUser = result.rows[0];

    await client.query(
      `INSERT INTO user_settings (user_id, language, theme_preference) VALUES ($1, $2, $3)`,
      [newUser.id, language, theme]
    );

    await client.query(
      `INSERT INTO user_ai_usages (user_id, daily_quota, total_generations) VALUES ($1, 10, 0)`,
      [newUser.id]
    );

    await client.query('COMMIT');
    return newUser; // returns newly created user (password_hash removed)
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// find user by id
export const findById = async (id) => {
  const text = 'SELECT * FROM users WHERE id = $1';
  const result = await query(text, [id]);
  return result.rows[0];
};

// ================= LẤY THÔNG TIN CÓ PASSWORD ĐỂ ĐỔI MẬT KHẨU =================
export const findByIdWithPassword = async (userId) => {
  const text = 'SELECT id, password_hash FROM users WHERE id = $1';
  const result = await query(text, [userId]);
  return result.rows[0];
};

// ================= CẬP NHẬT AVATAR =================
export const updateAvatar = async (userId, avatarUrl, avatarKey) => {
  const text = `
    UPDATE users
    SET avatar_url = $2, avatar_key = $3, modified_at = NOW()
    WHERE id = $1
    RETURNING id, username, email, avatar_url, avatar_key;
  `;
  const result = await query(text, [userId, avatarUrl, avatarKey]);
  return result.rows[0];
};

// ================= CẬP NHẬT MẬT KHẨU =================
export const updatePassword = async (userId, newPasswordHash) => {
  const text = `
    UPDATE users
    SET password_hash = $2, modified_at = NOW()
    WHERE id = $1;
  `;
  await query(text, [userId, newPasswordHash]);
};

// ================= CẬP NHẬT EMAIL =================
export const updateEmail = async (userId, newEmail) => {
  const text = `
    UPDATE users
    SET email = $2, modified_at = NOW()
    WHERE id = $1
    RETURNING id, username, email, avatar_url;
  `;
  const result = await query(text, [userId, newEmail]);
  return result.rows[0];
};

// ================= CẬP NHẬT SETTINGS (UPSERT MANUAL) =================
export const upsertSettings = async (userId, theme_preference, language) => {
  const checkText = 'SELECT user_id FROM user_settings WHERE user_id = $1';
  const checkRes = await query(checkText, [userId]);

  if (checkRes.rows.length > 0) {
    const updateText = `
      UPDATE user_settings
      SET theme_preference = COALESCE($2, theme_preference),
          language = COALESCE($3, language),
          modified_at = NOW()
      WHERE user_id = $1
      RETURNING *;
    `;
    const res = await query(updateText, [userId, theme_preference, language]);
    return res.rows[0];
  } else {
    // Default cho theme = light, vi nếu không đẩy giá trị
    const insertText = `
      INSERT INTO user_settings (user_id, theme_preference, language)
      VALUES ($1, COALESCE($2, 'light'), COALESCE($3, 'vi'))
      RETURNING *;
    `;
    const res = await query(insertText, [userId, theme_preference, language]);
    return res.rows[0];
  }
};

// ================= LẤY SETTINGS CỦA USER =================
export const getSettingsByUserId = async (userId) => {
  const text = 'SELECT * FROM user_settings WHERE user_id = $1';
  const result = await query(text, [userId]);
  return result.rows[0];
};
