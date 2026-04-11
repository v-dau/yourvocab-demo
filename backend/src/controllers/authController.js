import * as authService from '../services/authService.js';

export const signUp = async (req, res) => {
  try {
    const { username, password, email, language, theme } = req.body;

    if (!username || !password || !email) {
      return res.statusCode(400).json({
        message: 'Username, password and email are required',
      });
    }

    const newUser = await authService.signUp({ username, email, password, language, theme });

    return res.status(201).json({
      message: 'Registered successfully',
      user: newUser,
    });
  } catch (error) {
    console.error('Error during signUp:', error);

    //xử lý lỗi của tầng service
    if (error.statusCode) {
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }

    //xử lí lỗi đột xuất
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const signIn = async (req, res) => {
  try {
    //lấy thông tin đăng nhập từ req body
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ tài khoản và mật khẩu' });
    }

    //kiểm tra mật khẩu và tạo token ở tầng service
    const { user, accessToken, refreshToken } = await authService.signIn({ identifier, password });

    //đưa refresh token vào HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, //không cho nhúng mã JS phía client (giảm nguy cơ XSS)
      //nếu đang production thì bật https
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: Number(process.env.JWT_REFRESH_TOKEN_TTL_MS),
    });

    //trả access token vô response
    return res.status(200).json({
      message: `User ${user.username} logged in successfully`,
      accessToken,
      user,
    });
  } catch (error) {
    console.error('Error during signIn', error);

    if (error.statusCode) {
      if (error.code === 'USER_BANNED') {
        return res.status(error.statusCode).json({
          code: error.code,
          message: error.message,
          details: error.details,
        });
      }
      return res.status(error.statusCode).json({ code: error.code, message: error.message });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const signOut = async (req, res) => {
  try {
    //hủy cookie (config phải giống lúc đưa RT vào cookie)
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

//tạo AT mới từ RT
export const refreshToken = async (req, res) => {
  try {
    //lấy RT từ cookie
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }

    //logic ở service
    const accessToken = await authService.refreshToken(token);

    //trả AT mới cho client
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Error during refreshToken', error);
    if (error.statusCode) {
      if (error.code === 'USER_BANNED') {
        return res.status(error.statusCode).json({
          code: error.code,
          message: error.message,
          details: error.details,
        });
      }
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};
