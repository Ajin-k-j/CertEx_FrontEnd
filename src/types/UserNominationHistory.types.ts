import { Dayjs } from "dayjs";

export interface RowData {
  nominationId: number;
  certificationName: string;
  provider: string;
  criticality: string;
  appliedDate: Dayjs | null;
  plannedExamMonth: string;
  isDepartmentApproved: boolean;
  isLndApproved: boolean;
  examDate: Dayjs | null;
  examStatus: string;
  uploadCertificateStatus: string;
  skillMatrixStatus: string;
  reimbursementStatus: string;
  financialYear: string;
  costOfCertification: number;
}

export interface UserNominationHistoryDialogProps {
  open: boolean;
  onClose: () => void;
}
