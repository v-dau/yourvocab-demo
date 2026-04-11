import { v2 as cloudinary } from 'cloudinary';

// Nếu có url cấu hình trong env thì thiết lặp cấu hình Cloudinary rõ ràng và bắt buộc dùng https
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    secure: true,
  });
}

export const uploadStream = (buffer, folderName = 'avatars') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }],
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    stream.end(buffer);
  });
};

export const deleteImage = async (publicId) => {
  if (!publicId) return;
  try {
    // Thêm timeout để tránh request bị treo quá lâu
    // invalidate: true giúp xóa cache trên CDN của Cloudinary ngay lập tức
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
      timeout: 10000,
    });
    return result;
  } catch (error) {
    console.error(`Lỗi khi xóa file ${publicId} trên Cloudinary:`, error.message || error);
    // Return null thay vì throw lỗi để không làm gián đoạn luồng chính (ví dụ người dùng đổi avatar mới)
    return null;
  }
};
