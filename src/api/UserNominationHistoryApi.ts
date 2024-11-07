// api.ts
import axios from "axios";
import { RowData } from "../types/UserNominationHistory.types";
import dayjs from "dayjs";

export const fetchNominationHistory = async (): Promise<RowData[]> => {
  try {
    const response = await axios.get<RowData[]>("/Data/NominationHistory.json");
    const data = response.data || [];

    return data.map((item) => ({
      ...item,
      appliedDate: item.appliedDate ? dayjs(item.appliedDate) : null,
      examDate: item.examDate ? dayjs(item.examDate) : null,
    }));
  } catch (error) {
    console.error("Error fetching nomination history data:", error);
    throw new Error("Unable to fetch data.");
  }
};
