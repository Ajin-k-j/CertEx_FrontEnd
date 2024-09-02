import axios from "axios";

// Define the interface for the certification data
interface Certification {
  employeeId: number;
  certificationId: number;
  certificationName: string;
  providerName: string;
  level: string;
  category: string | null;
  fromDate: string;
  expiryDate: string;
  url: string | null;
}

// Define the interface for the rows of the data grid
export interface Row {
  id: number;
  certificationName: string;
  providerName: string;
  level: string;
  category: string | null;
  fromDate: string;
  expiryDate: string;
  url: string | null;
}
import data from "../../public/Data/User1_CertificateData.json"

// Function to fetch certifications
export const fetchCertifications = async (): Promise<Row[]> => {
  try {
    const response = await axios.get<Certification[]>(
      "https://localhost:7209/api/EmployeeCertification/1"
    );
    const data = response.data;
    return data.map((item) => ({
      id: item.certificationId,
      certificationName: item.certificationName,
      providerName: item.providerName,
      level: item.level,
      category: item.category,
      fromDate: item.fromDate,
      expiryDate: item.expiryDate,
      url: item.url,
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data");
  }
};
