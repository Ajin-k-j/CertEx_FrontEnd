import apiClient from "./BaseApi";
import { NominationData } from "../types/NominationForm.types";

export const fetchFinancialYear = async () => {
  try {
    const response = await apiClient.get<{ from_date: string; to_date: string }[]>("/financial_years");
    return response.data[0] || null;
  } catch (error) {
    console.error("Error fetching financial year:", error);
    throw new Error("Failed to fetch financial year. Please try again later.");
  }
};

export const submitNomination = async (newNomination: NominationData) => {
  try {
    await apiClient.post("/Nomination", newNomination);
  } catch (error) {
    console.error("Error submitting nomination:", error);
    throw new Error("Failed to submit nomination. Please try again later.");
  }
};
