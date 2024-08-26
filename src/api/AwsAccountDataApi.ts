import { AwsAccountDataRow } from '../types/AwsAccountData.types';
import axios from 'axios';

export const fetchAwsAccountData = async (): Promise<AwsAccountDataRow[]> => {
  try {
    const response = await axios.get<AwsAccountDataRow[]>('https://localhost:7209/api/AwsNomination/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching AWS Account Data:', error);
    throw error;
  }
};
