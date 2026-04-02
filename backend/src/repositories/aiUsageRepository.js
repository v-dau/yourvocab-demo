import { pool } from '../config/db.js';

class AIUsageRepository {
  async checkAndConsumeQuota(userId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Bước 1: SELECT thông tin từ user_ai_usages
      // Dùng CURRENT_DATE của DB để kiểm tra qua ngày một cách chính xác nhất
      const { rows } = await client.query(
        'SELECT daily_quota, total_generations, (last_used_date < CURRENT_DATE) as needs_reset FROM user_ai_usages WHERE user_id = $1 FOR UPDATE',
        [userId]
      );

      let quota = 0;

      if (rows.length === 0) {
        // Bước 2: Nếu KHÔNG CÓ dữ liệu (user cũ chưa được tạo), hãy thực hiện INSERT
        // Thêm total_generations = 1 vì đây là lần tạo đầu tiên
        await client.query(
          'INSERT INTO user_ai_usages (user_id, daily_quota, last_used_date, total_generations) VALUES ($1, $2, CURRENT_DATE, 1)',
          [userId, 10]
        );
        quota = 10;
      } else {
        const record = rows[0];
        quota = record.daily_quota;

        // Bước 3: Nếu ĐÃ CÓ dữ liệu, kiểm tra nếu qua ngày mới
        if (record.needs_reset) {
          // Reset daily_quota = 10 và last_used_date = ngày hôm nay
          await client.query(
            'UPDATE user_ai_usages SET daily_quota = $1, last_used_date = CURRENT_DATE WHERE user_id = $2',
            [10, userId]
          );
          quota = 10;
        }
      }

      // Bước 4: Kiểm tra daily_quota hiện tại
      if (quota <= 0) {
        const error = new Error('Bạn đã hết lượt dùng AI hôm nay.');
        error.statusCode = 402; // Báo lỗi 402 Payment Required để tránh bị Axios frontend nhầm với lỗi 403 xác thực
        throw error;
      }

      // Bước 5: Nếu hợp lệ, UPDATE trừ daily_quota đi 1 và tăng total_generations
      await client.query(
        'UPDATE user_ai_usages SET daily_quota = daily_quota - 1, total_generations = COALESCE(total_generations, 0) + 1, modified_at = NOW() WHERE user_id = $1',
        [userId]
      );

      await client.query('COMMIT');
      return quota - 1; // Trả về số lượt còn lại
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getQuota(userId) {
    const { rows } = await pool.query(
      'SELECT daily_quota, (last_used_date < CURRENT_DATE) as needs_reset FROM user_ai_usages WHERE user_id = $1',
      [userId]
    );

    if (rows.length === 0) {
      return 10;
    }

    const record = rows[0];
    if (record.needs_reset) {
      return 10;
    }

    return record.daily_quota;
  }
}

export default new AIUsageRepository();
