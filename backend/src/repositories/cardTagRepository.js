import { pool } from '../config/db.js';

class CardTagRepository {
  /**
   * Link an array of tag IDs to a specific card ID
   * @param {string} cardId - The UUID of the card
   * @param {string[]} tagIds - Array of tag UUIDs to link
   * @param {object} client - Optional database client for transaction support
   */
  async linkCardTags(cardId, tagIds, client = pool) {
    // Delete existing links for this card to easily perform updates
    const deleteQuery = 'DELETE FROM cards_tags WHERE card_id = $1';
    await client.query(deleteQuery, [cardId]);

    if (!tagIds || tagIds.length === 0) {
      return; // No tags to link
    }

    // Prepare batch insert
    const valuesPart = tagIds.map((_, index) => `($1, $${index + 2})`).join(', ');
    const insertQuery = `
      INSERT INTO cards_tags (card_id, tag_id)
      VALUES ${valuesPart}
    `;
    const params = [cardId, ...tagIds];

    await client.query(insertQuery, params);
  }
}

export default new CardTagRepository();
