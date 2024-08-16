// BarGraphApi.ts
import apiClient from './BaseApi';

export const fetchCertificationData = async () => {
  try {
    // Use the correct path to fetch data from the JSON server
    const response = await apiClient.get('/certificationData');
    // Check if the response has the expected data structure
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      console.log("success");
      return response.data[0]; // Return the first object in the data array
    } else {
      console.error('No data found in the response.');
      throw new Error('No data found.');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
