// api/fetchNominations.ts
import axios from 'axios';
import { DepartmentNominationsRow } from '../types/DepartmentNominationsTable.types';

export const fetchNominations = async (): Promise<DepartmentNominationsRow[]> => {
  try {
    const response = await axios.get('../../../public/Data/DepartmentNominationsData.json');
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
};
