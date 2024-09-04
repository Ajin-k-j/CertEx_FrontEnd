
import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = 'https://localhost:7209/api';

export interface CertificationDetails {
  certificationName: string;
  certificationDescription: string;
}

export interface Nomination {
  id: number;
  certificationId: number;
  employeeId: number;
  plannedExamMonth: string;
  motivationDescription: string;
  examDate: string;
  managerRecommendation: string;
  managerRemarks: string | null;
  isDepartmentApproved: boolean;
  isLndApproved: boolean;
  examStatus: string;
  nominationStatus: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ExamDetail {
  id: number;
  nominationId: number;
  myCertificationId: number;
  costInrWithoutTax: number;
  costInrWithTax: number;
  invoiceNumber: string;
  invoiceUrl: string;
  uploadCertificateStatus: string;
  skillMatrixStatus: string;
  reimbursementStatus: string;
}

// Function to fetch Nomination data by ID
export const fetchNominationById = async (id: number): Promise<Nomination> => {
  const response = await fetch(`${API_BASE_URL}/Nomination/${id}`);
  
  if (!response.ok) {
    throw new Error(`Error fetching nomination with ID ${id}: ${response.statusText}`);
  }

  const data: Nomination = await response.json();
  return data;
};

// Function to fetch all ExamDetails
export const fetchAllExamDetails = async (): Promise<ExamDetail[]> => {
  const response = await fetch(`${API_BASE_URL}/ExamDetail/allexamdetails`);
  
  if (!response.ok) {
    throw new Error(`Error fetching all exam details: ${response.statusText}`);
  }

  const data: ExamDetail[] = await response.json();
  return data;
};

//function to fetch the certification name and description
export const getCertificationDetails = async (
    nominationId: number
): Promise<CertificationDetails> => {
    try {
        const response: AxiosResponse<CertificationDetails> = await axios.get(
            `${API_BASE_URL}/UserActionFlow/${nominationId}/certification-details`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching certification details:', error);
        throw error; // Re-throw the error to be handled by the caller.
    }
};

export const getAdminsApprovalDetails = async (nominationId: number) => {
  const response = await axios.get(`https://localhost:7209/api/Nomination/${nominationId}/Details`);
  return response.data;
};


// Function to fetch ExamDetail data by NominationId
export const fetchExamDetailByNominationId = async (nominationId: number): Promise<ExamDetail | null> => {
  try {
      const response: AxiosResponse<ExamDetail> = await axios.get(`${API_BASE_URL}/ExamDetail/${nominationId}/Details`);
      return response.data;
  } catch (error) {
      console.error(`Error fetching ExamDetail with NominationId ${nominationId}:`, error);
      return null; // Return null or handle the error as needed
  }
};