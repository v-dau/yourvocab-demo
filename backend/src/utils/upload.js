import multer from 'multer';

// Sử dụng memoryStorage để lưu ảnh dưới dạng buffer thay vì lưu local file
const storage = multer.memoryStorage();
export const upload = multer({ storage });
