import jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/userRepository.js';

//authorization - verify who's the user
export const protectedRoute = (req, res, next) => {
  try {
    //extract the access token from the header
    const authHeader = req.headers['authorization'];
    //check if the header exists and start with "Bearer"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token not found' });
    }

    //verify the access token
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, async (err, decodedPayload) => {
      if (err) {
        console.error('Error verifying JWT: ', err.message);
        return res.status(403).json({ message: 'The access token is expired or incorrect' });
      }

      //find user in db using the userId attached in the token when sign in
      const user = await userRepository.findById(decodedPayload.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.is_banned) {
        return res.status(403).json({ message: 'This account is banned' });
      }

      //delete user password field before attach to the request
      delete user.password_hash;

      req.user = user;

      next();
    });
  } catch (error) {
    console.error('Error verifying JWT in authMiddleware', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
