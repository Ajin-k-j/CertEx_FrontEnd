export interface CertificationData {
  id: number;
  certificationName: string;
  costInr: number;
  costUsd: number;
  description: string;
  level: string;
  nominationCloseDate: string;
  nominationOpenDate: string;
  nominationStatus: string;
  officialLink: string;
  providerName: string;
  tags: string[];
  views: number;
}

export type CertificationLevel = "Beginner" | "Intermediate" | "Expert" | "all";
export type SortOption = "latest" | "popular" | "oldest" | "A-Z" | "Z-A";
