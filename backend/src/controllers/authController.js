import * as authService from '../services/authService.js';

export const signUp = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    //basic validation
    if (!username || !password || !email) {
      return res.statusCode(400).json({
        message: 'Username, password and email are required',
      });
    }

    //call the service layer to handle the business logic
    const newUser = await authService.signUp({ username, email, password });

    //return successful result (201 created)
    return res.status(201).json({
      message: 'Registered successfully',
      user: newUser,
    });
  } catch (error) {
    console.error('Error during signUp:', error);

    //handle known service-layer errors
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    //fallback for unexpected errors
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const signIn = async (req, res) => {
  try {
    //extract user credentials from the request body
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Missing username or password' });
    }

    //delegate password verifiction and JWT generation to the service layer
    const { user, accessToken, refreshToken } = await authService.signIn({ username, password });

    //set the refresh token in an HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, //prevents client-side JS access (mitigates XSS)
      //enable only in prod (requires HTTPS); disable in local dev
      secure: process.env.NODE_ENV === 'production',
      //use 'none' in cross-site cookies in prod; 'strict' for local dev
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: Number(process.env.JWT_REFRESH_TOKEN_TTL_MS),
    });

    //return the access token in the response body
    return res.status(200).json({
      message: `User ${user.username} logged in successfully`,
      accessToken, //client should store this in memory or localStorage
      user,
    });
  } catch (error) {
    console.error('Error during signIn', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const signOut = async (req, res) => {
  try {
    //clearCookie must use the same options as when the cookie was set (except maxAge)
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });

    return res.sendStatus(204);
  } catch (error) {
    console.error('Error during singOut', error);

    return res.status(500).json({ message: 'Internal server error' });
  }
};
