import apiClient from './BaseApi';
// Default initial values
const initialCertificationId = 1; 
const initialNominationId = '66ef'; 

export const fetchCertificationById = async (certification_id: number = initialCertificationId) => {
  try {
    const response = await apiClient.get(`/certification?certification_id=${certification_id}`);
    const certificationData = response.data;

    if (certificationData.length > 0) {
      return certificationData[0];
    } else {
      return { error: `No certification found with ID ${certification_id}.` };
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching certification with ID ${certification_id}:`, error.message);
      return { error: `Failed to fetch certification with ID ${certification_id}. Please try again later.` };
    } else {
      console.error(`Unexpected error fetching certification with ID ${certification_id}:`, error);
      return { error: `An unexpected error occurred. Please try again later.` };
    }
  }
};

// Function to fetch nomination by ID or update it
export const fetchNominationById = async (id: string = initialNominationId, updateData?: any) => {
  try {
    if (updateData) {
      const response = await apiClient.patch(`/nominations/${id}`, updateData);
      return response.data;
    } else {
      const response = await apiClient.get(`/nominations/${id}`);
      return response.data;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching nomination with ID ${id}:`, error.message);
      return { error: `Failed to fetch nomination with ID ${id}. Please try again later.` };
    } else {
      console.error(`Unexpected error fetching nomination with ID ${id}:`, error);
      return { error: `An unexpected error occurred. Please try again later.` };
    }
  }
};


// New endpoint to handle file upload
export const uploadCertificateFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // Assuming the response contains the file URL
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file. Please try again later.');
  }
};

// Function to update invoice details including invoice_status
export const updateInvoice = async (
  nominationId: string,
  invoiceData: {
    invoice_id: string;
    currency: string;
    price_without_tax: number;
    price_with_tax: number;
  }
) => {
  try {
    const updateData = {
      ...invoiceData,
      invoice_status: 'updated', // Set the invoice_status to 'updated'
    };

    const response = await apiClient.patch(`/nominations/${nominationId}`, updateData);

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error updating invoice for nomination ID ${nominationId}:`, error.message);
      return { error: `Failed to update invoice for nomination ID ${nominationId}. Please try again later.` };
    } else {
      console.error(`Unexpected error updating invoice for nomination ID ${nominationId}:`, error);
      return { error: `An unexpected error occurred. Please try again later.` };
    }
  }
};
