import axios from "axios";
import { DepartmentStatistics } from "../types/DepartmentStatistics.types";

export const fetchDepartmentStatistics =
  async (): Promise<DepartmentStatistics> => {
    try {
      const response = await axios.get<DepartmentStatistics>(
        "../../../public/Data/DepartmentStatistics.json"
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
