// api.ts
import axios from 'axios';
import apiClient from "./BaseApi";


export const fetchPendingNominations = async () => {
  try {
    const response = await axios('http://localhost:5000/pendingActions');
    return response.data;
  } catch (error) {
    console.error("Error fetching nominations", error);
    throw error;
  }
};

// Fetch pending nominations for L&D
export const fetchPendingLndApprovals = async () => {
  try {
    const response = await apiClient.get('/Nomination/pendingActions/Lnd');
    return response.data;
  } catch (error) {
    console.error("Error fetching L&D nominations", error);
    throw error;
  }
};

// Fetch pending nominations for a specific department
export const fetchPendingDepartmentApprovals = async (departmentId: number) => {
  try {
    const response = await apiClient.get(`/Nomination/pendingActions/Department/${departmentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching department nominations", error);
    throw error;
  }
};
