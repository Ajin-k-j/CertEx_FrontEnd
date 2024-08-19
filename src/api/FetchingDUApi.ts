import apiClient from './BaseApi';

export const fetchDU = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get('/dus');
    
    // Log the response to confirm its structure

    
    // Accessing the dus property if it exists
    if (response.data) {
      return response.data;
    } else {
      throw new Error('DUs property not found in response');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch DUs');
  }
};
