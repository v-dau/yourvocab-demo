import * as dashboardService from '../services/dashboardService.js';

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await dashboardService.getDashboardStats(userId);
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error in getDashboardStats controller:', error);
    res.status(500).json({ message: 'Internal server error while fetching dashboard stats.' });
  }
};
