export interface Row {
  nominationId: number;
  employeeId: number; 
  employeeName: string;
  email: string;
  department: string;
  provider: string;
  certificationName: string;
  criticality: string;
  plannedExamMonth: string;
  motivationDescription: string;
  managerRecommendation: string;
  managerRemarks: string;
  isDepartmentApproved: boolean;
  isLndApproved: boolean;
  examDate: string;
  examStatus: string;
  uploadCertificateStatus: string;
  skillMatrixStatus: string;
  reimbursementStatus: string;
  nominationStatus: string;
  financialYear: string;
  costOfCertification: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}
