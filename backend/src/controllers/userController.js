import * as userService from '../services/userService.js';

export const autMe = async (req, res) => {
  try {
    const user = req.user; //get from authMiddleware

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error during authMe', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const test = async (req, res) => {
  return res.sendStatus(204);
};

export const changeAvatar = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy từ authMiddleware
    const fileBuffer = req.file?.buffer; // Lấy từ middleware upload buffer

    const updatedUser = await userService.changeAvatar(userId, fileBuffer);
    return res.status(200).json({
      message: 'Cập nhật ảnh đại diện thành công',
      avatar_url: updatedUser.avatar_url,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Lỗi hệ thống' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    await userService.changePassword(userId, oldPassword, newPassword);
    return res.status(200).json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Lỗi hệ thống' });
  }
};

export const changeEmail = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newEmail } = req.body;

    const userObj = await userService.changeEmail(userId, newEmail);
    return res.status(200).json({
      message: 'Cập nhật email thành công',
      user: userObj,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Lỗi hệ thống' });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { theme_preference, language } = req.body;

    const settings = await userService.updateSettings(userId, theme_preference, language);
    return res.status(200).json({
      message: 'Cập nhật cấu hình thành công',
      settings,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Lỗi hệ thống' });
  }
};
