import * as dashboardRepository from '../repositories/dashboardRepository.js';

export const getDashboardStats = async (userId) => {
  const data = await dashboardRepository.getUserStats(userId);

  // Review stats mapping
  const reviewStats = {
    learning: 0,
    completed: 0,
  };

  data.reviewStats.forEach((row) => {
    if (row.is_completed) {
      reviewStats.completed = parseInt(row.count, 10);
    } else {
      reviewStats.learning = parseInt(row.count, 10);
    }
  });

  // Map parts of speech, handle nulls
  const cardsByPartOfSpeech = data.cardsByPartOfSpeech.map((row) => ({
    name: row.name || 'Unknown',
    value: parseInt(row.value, 10),
  }));

  // Map levels, handle nulls
  const cardsByLevel = data.cardsByLevel.map((row) => ({
    name: row.name ? row.name.trim() : 'Unknown',
    value: parseInt(row.value, 10),
  }));

  const practiceStats = {
    totalSentences: parseInt(data.practiceStats?.total_sentences || 0, 10),
    totalCardsPracticed: parseInt(data.practiceStats?.total_cards_practiced || 0, 10),
  };

  return {
    totalCards: data.totalCards,
    totalTags: data.totalTags,
    reviewStats,
    cardsByPartOfSpeech,
    cardsByLevel,
    practiceStats,
    aiUsage: data.aiUsage,
  };
};
