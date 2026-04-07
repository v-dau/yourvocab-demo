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

export const getUsers = async (req, res) => {
  try {
    const result = await adminService.getUsers(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching admin users: ', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const banUser = async (req, res) => {
  try {
    // const { id } = req.params;
    // const { reason, duration } = req.body;
    res.status(200).json({ success: true, message: 'Placeholder: User banned' });
  } catch (error) {
    console.error('Error banning user: ', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const unbanUser = async (req, res) => {
  try {
    // const { id } = req.params;
    res.status(200).json({ success: true, message: 'Placeholder: User unbanned' });
  } catch (error) {
    console.error('Error unbanning user: ', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
