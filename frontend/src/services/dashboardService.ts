import axiosInstance from '@/lib/axios';

export interface DashboardStats {
  totalCards: number;
  totalTags: number;
  reviewStats: {
    learning: number;
    completed: number;
  };
  cardsByPartOfSpeech: {
    name: string;
    value: number;
  }[];
  cardsByLevel: {
    name: string;
    value: number;
  }[];
  practiceStats: {
    totalSentences: number;
    totalCardsPracticed: number;
  };
  aiUsage: number;
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await axiosInstance.get('/dashboard/stats');
    return response.data;
  },
};
