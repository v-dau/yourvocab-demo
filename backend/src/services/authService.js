import bcrypt from 'bcrypt';
import * as userRepository from '../repositories/userRepository.js';
import { generateAccessToken, generateRefreshToken } from '../config/jwt.js';

export const signUp = async ({ username, email, password }) => {
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
  const newUser = await userRepository.create(username, email, hashedPassword);
  return newUser;
};

export const signIn = async ({ username, password }) => {
  //1. find user by username
  const user = await userRepository.findByUsername(username);
  if (!user) {
    const error = new Error('Username or password is incorrect');
    error.statusCode = 401; //Unauthorized
    throw error;
  }

  //2.compare the input password with the stored hashed password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const error = new Error('Username or password is incorrect');
    error.statusCode = 401;
    throw error;
  }

  //3.if matched, create an access token and a refresh token
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  //delete password_hash field to avoid leaking it in the response
  delete user.password_hash;

  return { user, accessToken, refreshToken };
};
