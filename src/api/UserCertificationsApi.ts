import axios from 'axios';

// Define the interface for the certification data
interface Certification {
  certificationId: number;
  certificationName: string;
  providerName: string;
  level: string;
  category: string;
  fromDate: string;
  expiryDate: string;
}

// Define the interface for the rows of the data grid
export interface Row {
  id: number;
  certificationName: string;
  providerName: string;
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
      id: item.certificationId,
      certificationName: item.certificationName,
      providerName: item.providerName,
      level: item.level,
      category: item.category,
      fromDate: item.fromDate,
      expiryDate: item.expiryDate,
    }));
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Error fetching data');
  }
};
