import apiClient from './BaseApi';

export const fetchProviders = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get('/providers');

    // Accessing the providers property if it exists
    if (response.data) {
      return response.data;
    } else {
      throw new Error('Providers property not found in response');
    }
  } catch (error) {
    console.error('Error fetching providers:', error);
    throw new Error('Failed to fetch Providers');
  }
};
