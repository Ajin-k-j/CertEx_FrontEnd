// types/NominationRow.ts
export interface DepartmentNominationsRow {
    
    id: number;
    employeeName: string;
    email: string;
    provider: string;
    certificationName: string;
    criticality: string;
    plannedMonthOfExam: string;
    status: string;
    motivation?: string;
    cost?: string;
  }
  