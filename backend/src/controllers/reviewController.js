import * as reviewService from '../services/reviewService.js';

export const getDueReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await reviewService.getDueReviewsGrouped(userId);

    res.status(200).json({
      success: true,
      data: result.grouped,
      total: result.total,
    });
  } catch (error) {
    console.error('Error getting due reviews:', error);
    res.status(500).json({ success: false, message: error.message || 'Lỗi server cục bộ.' });
  }
};

export const finishReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await reviewService.processReviewAction(id, userId);

    res.status(200).json({
      success: true,
      data: result.data || result,
    });
  } catch (error) {
    console.error('Error processing review action:', error);
    res.status(400).json({ success: false, message: error.message || 'Lỗi dữ liệu đầu vào.' });
  }
};
