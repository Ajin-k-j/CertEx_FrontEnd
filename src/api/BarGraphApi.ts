// api.ts
import axios from 'axios';

export const fetchCertificationData = async () => {
  try {
    const response = await axios.get('../../public/Data/BarGraphData.json'); // Adjust the path as needed
    if (response.data && response.data.certificationData && response.data.certificationData.length > 0) {
        console.log("success");
      return response.data.certificationData[0]; // Assuming certificationData is an array with one object
    } else {
      console.error('No data found in the response.');
      throw new Error('No data found.');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
