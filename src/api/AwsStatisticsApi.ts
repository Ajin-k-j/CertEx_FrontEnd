import axios from "axios";
import { AwsStatistics } from "../types/AwsStatistics.types";

const fetchAwsTotalData = async (): Promise<AwsStatistics> => {
  const response = await axios.get<AwsStatistics>(
    "../../public/Data/AwsStatistics.json"
  );
  return response.data;
};

export default fetchAwsTotalData;
