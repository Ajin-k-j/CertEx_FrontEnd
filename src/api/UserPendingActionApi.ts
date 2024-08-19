import apiClient from './BaseApi';

// Default initial values
const initialCertificationId = 1; // This is the ID you want to fetch
const initialNominationId = '32f2'; // Default value for nomination ID
// Function to fetch certification by ID
export const fetchCertificationById = async (certification_id: number = initialCertificationId) => {
  try {
    // Ensure the endpoint matches your JSON server structure
    const response = await apiClient.get(`/certification?certification_id=${certification_id}`);
    const certificationData = response.data;

    // Check if the response contains the certification with the given ID
    if (certificationData.length > 0) {
      console.log(certificationData[0]); // Logs the certification data fetched
      return certificationData[0]; // Return the first match since it's an array
    } else {
      return { error: `No certification found with ID ${certification_id}.` };
    }
  } catch (error) {
    console.error(`Error fetching certification with ID ${certification_id}:`, error.message);
    return { error: `Failed to fetch certification with ID ${certification_id}. Please try again later.` };
  }
};



// Function to fetch nomination by ID
export const fetchNominationById = async (id: string = initialNominationId,updateData?: any) => {
   try {
        if (updateData) {
          // If updateData is provided, perform a PATCH request
          const response = await apiClient.patch(`/nominations/${id}`, updateData);
          return response.data;
        } else {
            const response = await apiClient.get(`/nominations/${id}`);
            console.log(response.data); // Logs the nomination data fetched
            return response.data; // Returns the fetched nomination data
        }
      }
      catch (error) {
    console.error(`Error fetching nomination with ID ${id}:`, error.message);
    return { error: `Failed to fetch nomination with ID ${id}. Please try again later.` };
  }
};

// Example usage (uncomment to test)
// fetchCertificationById().then(data => console.log(data));
// fetchNominationById().then(data => console.log(data));
