import { query } from '../config/db.js';

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
export const create = async (username, email, passwordHash) => {
  const text = `
    INSERT INTO users (username, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, username, email, created_at;
  `;
  const result = await query(text, [username, email, passwordHash]);
  return result.rows[0]; // returns newly created user (password_hash removed)
};

// find user by id
export const findById = async (id) => {
  const text = 'SELECT * FROM users WHERE id = $1';
  const result = await query(text, [id]);
  return result.rows[0];
};
