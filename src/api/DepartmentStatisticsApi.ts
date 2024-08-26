import axios from 'axios';
import { DepartmentStatistics } from '../types/DepartmentStatistics.types';

export const fetchDepartmentStatistics = async (): Promise<DepartmentStatistics> => {
  try {
    const response = await axios.get<DepartmentStatistics>(
      'https://localhost:7209/api/DepartmentStats/1'
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
