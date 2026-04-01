import { pool } from '../config/db.js';

class AIUsageRepository {
  async checkAndConsumeQuota(userId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Bước 1: SELECT thông tin từ user_ai_usages
      // SELECT FOR UPDATE để tránh race condition khi gọi nhiều requests lúc
      const { rows } = await client.query(
        'SELECT * FROM user_ai_usages WHERE user_id = $1 FOR UPDATE',
        [userId]
      );

      let quota = 0;
      // Dùng Cổ điển để lấy date: yyyy-mm-dd
      const todayObj = new Date();
      // Chỉnh múi giờ phù hợp hoặc chỉ lấy ngày UTC
      const today = todayObj.toISOString().split('T')[0];

      if (rows.length === 0) {
        // Bước 2: Nếu KHÔNG CÓ dữ liệu (user cũ chưa được tạo), hãy thực hiện INSERT
        await client.query(
          'INSERT INTO user_ai_usages (user_id, daily_quota, last_used_date, total_generations) VALUES ($1, $2, $3, $4)',
          [userId, 10, today, 0]
        );
        quota = 10;
      } else {
        const record = rows[0];
        // Ensure accurate date comparison (ignore hour/min/sec)
        const lastUsedDate = record.last_used_date.toISOString().split('T')[0];
        quota = record.daily_quota;

        // Bước 3: Nếu ĐÃ CÓ dữ liệu, kiểm tra last_used_date
        if (lastUsedDate < today) {
          // Reset daily_quota = 10 và last_used_date = ngày hôm nay
          await client.query(
            'UPDATE user_ai_usages SET daily_quota = $1, last_used_date = $2, modified_at = NOW() WHERE user_id = $3',
            [10, todayObj, userId] // Use todayObj which is Date object for timestamp
          );
          quota = 10;
        }
      }

      // Bước 4: Kiểm tra daily_quota hiện tại
      if (quota <= 0) {
        const error = new Error('Bạn đã hết lượt dùng AI hôm nay.');
        error.statusCode = 403;
        throw error;
      }

      // Bước 5: Nếu hợp lệ, UPDATE trừ daily_quota đi 1
      await client.query(
        'UPDATE user_ai_usages SET daily_quota = daily_quota - 1, total_generations = total_generations + 1, modified_at = NOW() WHERE user_id = $1',
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
}

export default new AIUsageRepository();
