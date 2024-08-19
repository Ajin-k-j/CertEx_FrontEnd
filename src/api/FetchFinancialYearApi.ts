// src/api/FetchFinancialYearsApi.ts
import apiClient from './BaseApi';

export const fetchFinancialYears = async () => {
  try {
    const response = await apiClient.get('/financial_years');
    return response.data;
  } catch (error) {
    console.error('Error fetching financial years:', error);
    throw error;
  }
};
