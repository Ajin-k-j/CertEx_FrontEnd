import axios from "axios";
const API_URL = "https://localhost:7209/api/UserPendingAction/pending-actions";

export const fetchUserPendingActions = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching user pending actions:", error);
    throw error;
  }
};
