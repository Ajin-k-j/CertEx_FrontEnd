import apiClient from "./BaseApi";

export interface NominationData {
  certification_id: number;
  planned_exam_month: string;
  motivation_description: string;
  employee_id: number;
}

export const fetchFinancialYear = async () => {
  try {
    const response = await apiClient.get<{ from_date: string; to_date: string }[]>("/financial_years");
    return response.data[0] || null;
  } catch (error) {
    console.error("Error fetching financial year:", error);
    throw error;
  }
};

export const submitNomination = async (newNomination: NominationData) => {
  try {
    await apiClient.post("/nominations", newNomination);
  } catch (error) {
    console.error("Error submitting nomination:", error);
    throw error;
  }
};
