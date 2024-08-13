import axios from 'axios';

export interface DepartmentTotalData {
  department: string;
  employees: number;
  certifications: number;
}

export const fetchDepartmentTotalData = async (): Promise<DepartmentTotalData> => {
  try {
    const response = await axios.get<DepartmentTotalData>('../../public/Data/DepartmentTotalData.json');
    return response.data;
  } catch (error) {
    console.error('Error fetching department total data:', error);
    throw error; // Rethrow error to be handled by the caller
  }
};
