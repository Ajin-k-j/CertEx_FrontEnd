import axios from 'axios';
import { Row } from '../types/LdNominations.types';

export const fetchLdNominationData = async (): Promise<Row[]> => {
  try {
    const response = await axios.get<Row[]>('../../../public/Data/LDNominationData.json'); // Adjust path if needed
    return response.data.map((item, index) => ({ id: index + 1, ...item }));
  } catch (error) {
    throw new Error('Error fetching data');
  }
};
