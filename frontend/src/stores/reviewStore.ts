import { create } from 'zustand';

interface ReviewState {
  totalDue: number;
  setTotalDue: (count: number) => void;
  decrementTotalDue: () => void;
}

export const useReviewStore = create<ReviewState>((set) => ({
  totalDue: 0,
  setTotalDue: (count) => set({ totalDue: count }),
  decrementTotalDue: () => set((state) => ({ totalDue: Math.max(0, state.totalDue - 1) })),
}));
