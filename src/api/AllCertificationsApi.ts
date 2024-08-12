import apiClient from "./BaseApi";

export interface CertificationData {
  id: number;
  provider: string;
  certification_name: string;
  level: "Beginner" | "Intermediate" | "Expert";
  description: string;
  tags: string[];
  official_link: string;
  critical: string;
  views: number;
}

export const fetchCertifications = async (): Promise<CertificationData[]> => {
    const response = await apiClient.get<CertificationData[]>("/certifications");
    return response.data;
  };
