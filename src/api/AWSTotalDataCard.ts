import axios from 'axios';

export interface AwsTotalData {
  totalAccounts: string;
  activeAccounts: number;
  inactiveAccounts: number;
}

export const fetchAwsTotalData = async (): Promise<AwsTotalData> => {
  try {
    const response = await axios.get<AwsTotalData>('../../public/Data/AWSTotalData.json');
    return response.data;
  } catch (error) {
    console.error('Error fetching AWS total data:', error);
    throw error; // Rethrow error to be handled by the caller
  }
};
