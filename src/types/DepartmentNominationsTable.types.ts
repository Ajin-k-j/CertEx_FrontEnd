// types/NominationRow.ts
export interface NominationRow {
    
  nominationId: number;
  employeeName: string;
  email: string;
  provider: string;
  certificationName: string;
  level?: string;
  plannedMonthOfExam: string;
  status: string;
  motivationDescription?: string;
}
