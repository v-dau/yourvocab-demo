import * as adminRepository from '../repositories/adminRepository.js';

export const getAdminStats = async () => {
  const stats = await adminRepository.getGlobalStats();

  return {
    data: {
      users: {
        total: stats.totalUsers,
        new: stats.newUsers,
      },
      cards: {
        total: stats.totalCards,
        completed: stats.totalCompletedCards,
      },
      engagement: {
        totalSentences: stats.totalPracticeSentences,
        totalTags: stats.totalTags,
        totalAiUsage: stats.totalAiUsage,
      },
    },
  };
};
