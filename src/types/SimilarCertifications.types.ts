export interface CertificationData {
    id: number;
    provider: string;
    certification_name: string;
    level: string;
    certification_date: string;
  }
  
  export interface SimilarCertificationsResponse {
    certifications: CertificationData[];
  }
  