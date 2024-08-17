import apiClient from "./BaseApi";

export const fetchPendingNominations = async () => {
  try {
    const response = await apiClient.get('/pendingActions');
    return response.data;
  } catch (error) {
    console.error("Error fetching nominations", error);
    throw error;
  }
};
