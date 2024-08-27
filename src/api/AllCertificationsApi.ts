import apiClient from "./BaseApi";
import axios from 'axios';
interface Certification {
  id: number;
  provider: string;
  certification_name: string;
  level: string;
  description: string;
  official_link: string;
  critical: string;
  views: number;
  nomination_status: string;
  nomination_open_date: string;
  nomination_close_date: string;
  tags: string[]; // Tags as string array
}
import {CertificationData} from "../types/AllCertifications.types"
export const fetchCertificationsjson = async (): Promise<Certification[]> => {
    const response = await axios.get('http://localhost:5000/certifications');
    return response.data;
  };


//for api integration
  export const fetchCertifications = async (): Promise<CertificationData[]> => {
    const response = await apiClient.get<CertificationData[]>("CertificationExam/allcertificationexams");
    return response.data;
  };

  export const submitCertification = async (newCertification: CertificationData) => {
    try {
      // await apiClient.post("/certifications", newCertification);
      await axios.post("http://localhost:5000/certifications", newCertification);
    } catch (error) {
      console.error("Error submitting certification:", error);
      throw error;
    }
  };

  export const updateCertification = async (id: string, updatedCertification: CertificationData) => {
    try {
      // await apiClient.put(`/certifications/${id}`, updatedCertification);
      await axios.put(`http://localhost:5000/certifications/${id}`, updatedCertification);
    } catch (error) {
      console.error("Error updating certification:", error);
      throw error;
    }
  };


// Function to delete a certification
export const deleteCertification = async (id: number) => {
  await apiClient.delete(`/certifications/${id}`);
};

// Update an existing certification
export const updateCertificationF = async (id: number, certification: CertificationData): Promise<CertificationData> => {
  try {
    const response = await apiClient.put(`/certifications/${id}`, certification);
    return response.data;
  } catch (error) {
    console.error('Failed to update certification', error);
    throw error;
  }
};
