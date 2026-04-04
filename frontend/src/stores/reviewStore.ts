import { create } from 'zustand';
import api from '@/lib/axios';

interface ReviewState {
  totalDue: number;
  setTotalDue: (count: number) => void;
  decrementTotalDue: () => void;
  fetchTotalDue: () => Promise<void>;
}

export const useReviewStore = create<ReviewState>((set) => ({
  totalDue: 0,
  setTotalDue: (count) => set({ totalDue: count }),
  decrementTotalDue: () => set((state) => ({ totalDue: Math.max(0, state.totalDue - 1) })),
  fetchTotalDue: async () => {
    try {
      const res = await api.get('/reviews/due');
      if (res.data?.success) {
        set({ totalDue: res.data.total });
      }
    } catch (err) {
      console.error('Failed to fetch due reviews count', err);
    }
  },
}));
