export interface RowData {
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
  nominationDate: Date;
  examDate: string | Date;
  examStatus: string;
  uploadCertificateStatus: string;
  skillMatrixStatus: string;
  reimbursementStatus: string;
  nominationStatus: string;
  financialYear: string;
  costOfCertification: number;
}
