import bcrypt from 'bcrypt';
import * as userRepository from '../repositories/userRepository.js';
import { uploadStream, deleteImage } from '../utils/cloudinary.js';

export const changeAvatar = async (userId, fileBuffer) => {
  if (!fileBuffer) {
    const error = new Error('Vui lòng upload ảnh');
    error.code = 'MISSING_IMAGE';
    throw error;
  }

  // 1. Lấy user hiện tại để kiểm tra avatar cũ
  const user = await userRepository.findById(userId);
  if (!user) {
    const error = new Error('Không tìm thấy người dùng');
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  // 2. Xóa ảnh cũ trên cloudinary nếu có
  if (user.avatar_key) {
    await deleteImage(user.avatar_key);
  }

  // 3. Upload ảnh mới lên Cloudinary (chỗ buffer)
  const uploadResult = await uploadStream(fileBuffer, 'yourvocab/avatars');

  // 4. Update url & key vào Database
  const updatedUser = await userRepository.updateAvatar(
    userId,
    uploadResult.secure_url,
    uploadResult.public_id
  );

  return updatedUser;
};

export const changePassword = async (userId, oldPassword, newPassword) => {
  if (!oldPassword || !newPassword) {
    const error = new Error('Dữ liệu không hợp lệ');
    error.code = 'INVALID_DATA';
    throw error;
  }

  // 1. Lấy record user chứa cả password_hash
  const user = await userRepository.findByIdWithPassword(userId);
  if (!user) {
    const error = new Error('Không tìm thấy người dùng');
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  // 2. So sánh mật khẩu cũ
  const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
  if (!isMatch) {
    const error = new Error('Mật khẩu cũ không chính xác');
    error.code = 'WRONG_OLD_PASSWORD';
    error.statusCode = 401;
    throw error;
  }

  // 3. Mã hóa và lưu mật khẩu mới
  const salt = await bcrypt.genSalt(10);
  const newHash = await bcrypt.hash(newPassword, salt);
  await userRepository.updatePassword(userId, newHash);
};

export const changeEmail = async (userId, newEmail) => {
  if (!newEmail) {
    const error = new Error('Email không được để trống');
    error.code = 'MISSING_EMAIL';
    throw error;
  }
  try {
    const updatedUser = await userRepository.updateEmail(userId, newEmail);
    return updatedUser;
  } catch (error) {
    // 23505 là mã lỗi PostgreSQL với Unique Violation constraint
    if (error.code === '23505') {
      const customError = new Error('Email này đã được sử dụng bởi người khác', { cause: error });
      customError.code = 'EMAIL_IN_USE';
      customError.statusCode = 409;
      throw customError;
    }
    throw error;
  }
};

export const updateSettings = async (userId, theme_preference, language) => {
  const settings = await userRepository.upsertSettings(userId, theme_preference, language);
  return settings;
};
export const getSettings = async (userId) => {
  const settings = await userRepository.getSettingsByUserId(userId);
  return settings;
};
