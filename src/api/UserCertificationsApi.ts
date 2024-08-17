import axios from 'axios';

// Define the interface for the certification data
interface Certification {
  certification_id: number;
  "Certification Name": string;
  Provider: string;
  Level: string;
  Category: string;
  "From Date": string;
  "Expiry Date": string;
}

// Define the interface for the rows of the data grid
export interface Row {
  id: number;
  certificationName: string;
  provider: string;
  level: string;
  category: string;
  fromDate: string;
  expiryDate: string;
}

// Function to fetch certifications
export const fetchCertifications = async (): Promise<Row[]> => {
  try {
    const response = await axios.get<{ user_id: number; certifications: Certification[] }>(
      '../../public/Data/User1_CertificateData.json'
    );
    const data = response.data.certifications;
    return data.map((item) => ({
      id: item.certification_id,
      certificationName: item['Certification Name'],
      provider: item.Provider,
      level: item.Level,
      category: item.Category,
      fromDate: item['From Date'],
      expiryDate: item['Expiry Date'],
    }));
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Error fetching data');
  }
};
