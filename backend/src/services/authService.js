import bcrypt from 'bcrypt';
import * as userRepository from '../repositories/userRepository.js';
import { generateAccessToken, generateRefreshToken } from '../config/jwt.js';
import jwt from 'jsonwebtoken';
import { checkAndUpdatedUserBanStatus } from './banService.js';

export const signUp = async ({ username, email, password, language, theme }) => {
  // 1.check if username exists
  const duplicatedUsername = await userRepository.findByUsername(username);
  if (duplicatedUsername) {
    const error = new Error('Username is already in use');
    error.statusCode = 409;
    throw error;
  }

  // 2.check if email exists
  const duplicatedEmail = await userRepository.findByEmail(email);
  if (duplicatedEmail) {
    const error = new Error('Email is already in use');
    error.statusCode = 409;
    throw error;
  }

  // 3.hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // 4.save to database
  const newUser = await userRepository.create(username, email, hashedPassword, language, theme);
  return newUser;
};

export const signIn = async ({ identifier, password }) => {
  //check if the user used username or email
  const isEmail = identifier.includes('@');

  let user;
  if (isEmail) {
    user = await userRepository.findByEmail(identifier);
  } else {
    user = await userRepository.findByUsername(identifier);
  }

  if (!user) {
    const error = new Error('Tài khoản hoặc email chưa được đăng ký');
    error.statusCode = 404; // Not Found
    throw error;
  }

  //compare the input password with the stored hashed password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const error = new Error('Sai tài khoản hoặc mật khẩu!');
    error.statusCode = 401;
    throw error;
  }

  // check ban status
  if (user.is_banned) {
    const banStatus = await checkAndUpdatedUserBanStatus(user.id);
    if (banStatus.isBanned) {
      const error = new Error('Tài khoản của bạn đã bị khóa');
      error.statusCode = 403;
      error.code = 'USER_BANNED';
      error.details = { reason: banStatus.reason, expiry: banStatus.expiry };
      throw error;
    }
  }

  //if matched, create an access token and a refresh token
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  //delete password_hash field to avoid leaking it in the response
  delete user.password_hash;

  return { user, accessToken, refreshToken };
};

export const refreshToken = async (token) => {
  try {
    //the verify function will automatically throw an error if the token expires or the signature is incorrect
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await userRepository.findById(decoded.id);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    if (user.is_banned) {
      const banStatus = await checkAndUpdatedUserBanStatus(user.id);
      if (banStatus.isBanned) {
        const error = new Error('Tài khoản của bạn đã bị khóa');
        error.statusCode = 403;
        error.code = 'USER_BANNED';
        error.details = { reason: banStatus.reason, expiry: banStatus.expiry };
        throw error;
      }
    }

    //get the id only, avoid attaching old token's 'exp' or 'iat' field to the new token
    const newAccessToken = generateAccessToken(decoded.id);

    return newAccessToken;
  } catch (error) {
    console.error('Refresh Token Error:', error.message);

    const customError = new Error(error.message || 'Invalid or expired refresh token');
    customError.statusCode = error.statusCode || 403; //attach 403 status code so the controller can handle it accordingly
    customError.code = error.code;
    customError.details = error.details;
    throw customError;
  }
};
