import axios from 'axios';
import { AwsStatistics } from '../types/AwsStatistics.types';

const fetchAwsTotalData = async (): Promise<AwsStatistics> => {
  try {
    const response = await axios.get<AwsStatistics>('https://localhost:7209/api/AwsStats');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default fetchAwsTotalData;
