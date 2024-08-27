// api/fetchNominations.ts
import axios from 'axios';
import { NominationRow } from '../types/DepartmentNominationsTable.types';

// Define the API URL
const API_URL = 'https://localhost:7209/api/DepartmentNominations/1';

export const fetchNominations = async (): Promise<NominationRow[]> => {
  try {
    // Make the GET request to the API endpoint
    const response = await axios.get<NominationRow[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    // Rethrow the error to be handled by the caller
    throw error;
  }
};
