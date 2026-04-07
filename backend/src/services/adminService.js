import * as adminRepository from '../repositories/adminRepository.js';

export const getAdminStats = async () => {
  return await adminRepository.getGlobalStats();
};
