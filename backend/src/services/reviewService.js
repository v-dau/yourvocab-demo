import reviewRepository from '../repositories/reviewRepository.js';

const SCHEDULE = [0, 1, 3, 7, 14, 30];

export const getDueReviewsGrouped = async (userId) => {
  const cards = await reviewRepository.getDueReviewCards(userId, new Date());
  const grouped = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  };
  let total = 0;

  for (const card of cards) {
    if (grouped[card.step_index] !== undefined) {
      grouped[card.step_index].push(card);
      total++;
    }
  }

  return { grouped, total };
};

export const processReviewAction = async (cardId, userId) => {
  const tracker = await reviewRepository.getReviewTracker(cardId, userId);

  if (!tracker) {
    throw new Error('Thẻ không tồn tại hoặc bạn không có quyền thao tác.');
  }

  if (tracker.is_completed) {
    return { success: true, message: 'Thẻ đã hoàn thành quá trình ôn tập.' };
  }

  const currentStepIndex = tracker.step_index;
  let newStepIndex = currentStepIndex;
  let isCompleted = false;
  let nextReviewDate;

  const now = new Date();

  // Mốc cuối cùng
  if (currentStepIndex === 5) {
    isCompleted = true;
    nextReviewDate = now; // Không cần thiết tính ngày tiếp nữa vì đã hoàn tất
  } else {
    // Tăng cấp độ
    newStepIndex = currentStepIndex + 1;
    // Tính dayCount: Ngày ở step mới trừ ngày ở step cũ
    const dayCount = SCHEDULE[newStepIndex] - SCHEDULE[currentStepIndex];
    // Cộng date hiện tại với số ngày quy định
    nextReviewDate = new Date(now);
    nextReviewDate.setDate(now.getDate() + dayCount);
  }

  const updatedTracker = await reviewRepository.updateReviewTracker(
    cardId,
    newStepIndex,
    nextReviewDate,
    isCompleted
  );

  return {
    success: true,
    data: updatedTracker,
  };
};
