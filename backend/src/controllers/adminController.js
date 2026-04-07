import * as adminService from '../services/adminService.js';

export const getStats = async (req, res) => {
  try {
    const stats = await adminService.getAdminStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching admin stats: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
