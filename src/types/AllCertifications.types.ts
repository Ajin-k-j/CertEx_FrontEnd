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
    nomination_open_date: string; 
    nomination_close_date: string;
}

export type CertificationLevel = "Beginner" | "Intermediate" | "Expert" | "all";
export type SortOption = "latest" | "popular" | "oldest" | "A-Z" | "Z-A";