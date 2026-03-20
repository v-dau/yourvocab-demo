import jwt from 'jsonwebtoken';

// prettier-ignore
export const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_ACCESS_SECRET, 
    { expiresIn: process.env.JWT_ACCESS_TOKEN_TTL }
  );
};

// prettier-ignore
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_REFRESH_SECRET, 
    { expiresIn: process.env.JWT_REFRESH_TOKEN_TTL }
  );
};
