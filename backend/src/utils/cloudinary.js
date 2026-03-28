import { v2 as cloudinary } from 'cloudinary';

// Configure explicitly using env var instead of relying on auto-detect implicitly
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    secure: true,
  });
}

export const uploadStream = (buffer, folderName = 'avatars') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: folderName }, (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    stream.end(buffer);
  });
};

export const deleteImage = async (publicId) => {
  if (!publicId) return;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Lỗi khi xóa file trên Cloudinary:', error);
  }
};
