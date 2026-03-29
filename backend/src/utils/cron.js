import cron from 'node-cron';
import { pool } from '../config/db.js';

export const startCronJobs = () => {
  // Chạy vào 2h sáng mỗi ngày
  // '0 2 * * *'
  cron.schedule('0 2 * * *', async () => {
    console.log('[CRON] Running daily trash cleanup at 2 AM...');
    try {
      const query = `
        DELETE FROM public.cards 
        WHERE deleted_at <= NOW() - INTERVAL '14 days';
      `;
      const result = await pool.query(query);
      console.log(`[CRON] Cleanup finished. Deleted ${result.rowCount} cards permanently.`);
    } catch (error) {
      console.error('[CRON] Error during trash cleanup:', error);
    }
  });
};
