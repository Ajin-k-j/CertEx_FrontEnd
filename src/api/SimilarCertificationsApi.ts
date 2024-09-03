import apiClient from "./BaseApi";
import { CertificationData } from "../types/AllCertifications.types";

export const fetchSimilarCertifications = async (): Promise<
  CertificationData[]
> => {
  const response = await apiClient.get<CertificationData[]>("/similar");
  return response.data;
};
