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

export const getUsers = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const search = query.search || '';
  const sortBy = query.sortBy || 'newest';
  const filterBanned = query.filterBanned === 'true';

  const result = await adminRepository.getUsersWithStats(page, limit, search, sortBy, filterBanned);

  return {
    success: true,
    data: result.users,
    pagination: {
      total: result.totalCount,
      page,
      limit,
    },
  };
};

export const getFeedbacks = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const search = query.search || '';
  const sortBy = query.sortBy || 'newest';
  const filterRead = query.filterRead || 'all';

  const result = await adminRepository.getFeedbacks(page, limit, search, sortBy, filterRead);

  return {
    success: true,
    data: result.feedbacks,
    pagination: {
      total: result.totalCount,
      page,
      limit,
    },
  };
};

export const markFeedbackAsRead = async (feedbackId) => {
  const success = await adminRepository.markFeedbackAsRead(feedbackId);
  return success;
};


export const changeUserPassword = async (userId, newPassword) => {
  return await adminRepository.updateUserPassword(userId, newPassword);
};
