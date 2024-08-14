import apiClient from '../api/BaseApi'; // Import the base API client
import {UpcomingExam} from '../types/UpcomingExams.types'


// Fetch Upcomingexams from the endpoint
export const fetchUpcomingExams = async (): Promise<UpcomingExam[]> => {
  try {
    const response = await apiClient.get<UpcomingExam[]>('/exams');
    return response.data;
  } catch (error) {
    console.error('Error fetching Upcomingexams:', error);
    throw error;
  }
};
