import apiClient from "./BaseApi";
import {CertificationData} from "../types/AllCertifications.types"
export const fetchCertifications = async (): Promise<CertificationData[]> => {
    const response = await apiClient.get<CertificationData[]>("/certifications");
    return response.data;
  };

export { CertificationData };
