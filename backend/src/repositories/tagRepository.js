import { pool } from '../config/db.js';

class TagRepository {
  async getAllTagsByUserId(userId) {
    const query = `
      SELECT t.id, t.tag_name as "tagName", t.created_at as "createdAt",
             COUNT(ct.card_id)::int AS "cardCount"
      FROM tags t
      LEFT JOIN cards_tags ct ON t.id = ct.tag_id
      WHERE t.user_id = $1
      GROUP BY t.id
      ORDER BY t.tag_name ASC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  async createTag(userId, tagName, client = pool) {
    const query = `
      INSERT INTO tags (user_id, tag_name)
      VALUES ($1, $2)
      RETURNING id, tag_name as "tagName", created_at as "createdAt"
    `;
    const result = await client.query(query, [userId, tagName]);
    return result.rows[0];
  }

  async getTagById(id, userId) {
    const query = `
      SELECT id, tag_name as "tagName", created_at as "createdAt"
      FROM tags
      WHERE id = $1 AND user_id = $2
    `;
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
  }

  async updateTag(id, userId, tagName) {
    const query = `
      UPDATE tags
      SET tag_name = $1
      WHERE id = $2 AND user_id = $3
      RETURNING id, tag_name as "tagName", created_at as "createdAt"
    `;
    const result = await pool.query(query, [tagName, id, userId]);
    return result.rows[0];
  }

  async deleteTag(id, userId) {
    // Rely on CASCADE if foreign keys are set up, else manually clean up cards_tags
    // Usually it's better to manually delete from cards_tags first to be safe
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM cards_tags WHERE tag_id = $1', [id]);
      const result = await client.query(
        'DELETE FROM tags WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, userId]
      );
      await client.query('COMMIT');
      return result.rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}

export default new TagRepository();
