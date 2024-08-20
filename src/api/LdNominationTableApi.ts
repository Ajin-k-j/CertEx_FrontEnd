import axios from 'axios';
import { Row } from '../types/LdNominations.types';


export const fetchLdNominationData = async (): Promise<Row[]> => {
  try {
    const response = await axios.get<Row[]>('../../public/Data/LDNominationData.json');
    return response.data;
  } catch (error) {
    console.error('Error fetching nomination data', error);
    throw error;
  }
};