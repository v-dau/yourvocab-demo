import * as banRepository from '../repositories/banRepository.js';
import * as userRepository from '../repositories/userRepository.js';
import { pool } from '../config/db.js';

export const checkAndUpdatedUserBanStatus = async (userId) => {
  const ban = await banRepository.getActiveBan(userId);

  if (!ban) {
    return { isBanned: false };
  }

  if (ban.duration === null) {
    return { isBanned: true, reason: ban.reason, expiry: null };
  }

  const createdAt = new Date(ban.created_at);
  const durationMs = ban.duration * 60 * 60 * 1000;
  const expiryTime = new Date(createdAt.getTime() + durationMs);
  const now = new Date();

  if (expiryTime > now) {
    return { isBanned: true, reason: ban.reason, expiry: expiryTime };
  } else {
    // Ban has expired
    await banRepository.updateBanStatus(ban.id, 2);
    // Also make sure to unban the user in the main table if is_banned column exists
    await userRepository.updateBanStatus(userId, false);
    return { isBanned: false };
  }
};

export const banUser = async (userId, reason, duration) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Revoke previous active bans
    await banRepository.revokeAllActiveBans(userId, client);

    // Create new ban
    const newBan = await banRepository.createBan(userId, reason, duration, client);

    // Update user table
    await userRepository.updateBanStatus(userId, true, client);

    await client.query('COMMIT');
    return newBan;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const unbanUser = async (userId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Revoke previous active bans
    await banRepository.revokeAllActiveBans(userId, client);

    // Update user table
    await userRepository.updateBanStatus(userId, false, client);

    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getBanInfo = async (userId) => {
  // Get the most recent active ban
  return await banRepository.getActiveBan(userId);
};
