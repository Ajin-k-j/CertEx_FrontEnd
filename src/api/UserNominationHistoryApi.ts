// api.ts
import axios from "axios";
import { RowData } from "../types/UserNominationHistory.types";
import dayjs from "dayjs";

export const fetchNominationHistory = async (): Promise<RowData[]> => {
  try {
    const response = await axios.get<RowData[]>("Data/NominationHistory.json");//https://localhost:7209/api/LDNomination/4   ///Data/NominationHistory.json

    // Set data to an empty array if response.data is null
    const data = response.data || [];

    return data.map((item) => ({
      ...item,
      appliedDate: item.createdAt ? dayjs(item.createdAt) : null,
      examDate: item.examDate ? dayjs(item.examDate) : null,
    }));
  } catch (error) {
    console.error("Error fetching nomination history data:", error);
    throw new Error("Unable to fetch data.");
  }
};
