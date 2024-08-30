import axios from "axios";

// Define the base URL
const BASE_URL = "https://localhost:7209/api";

// Define interfaces for the API responses
interface FinancialYear {
  id: number;
  fromDate: string;
  toDate: string;
  status: string;
}

interface FinancialYearLabel {
  id: number;
  label: string;
}

interface Department {
  id: number;
  departmentName: string;
}

interface DepartmentLabel {
  id: number;
  label: string;
}

interface CertificationProvider {
  id: number;
  providerName: string;
}

interface CertificationProviderLabel {
  id: number;
  label: string;
}

// Function to fetch the LndBarGraph data with optional filters
export const fetchLndBarGraphData = async (
  financialYearId: number,
  departmentId?: number,
  providerId?: number
) => {
  try {
    let url = `${BASE_URL}/LndBarGraph/filtered?financialYearId=${financialYearId}`;

    if (departmentId) {
      url += `&departmentId=${departmentId}`;
    }

    if (providerId) {
      url += `&providerId=${providerId}`;
    }

    const response = await axios.get<Record<string, number>>(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching LndBarGraph data:", error);
    throw error;
  }
};

// Function to fetch the AwsBarGraph data with optional filters
export const fetchAwsBarGraphData = async (
  financialYearId: number,
  departmentId?: number
) => {
  try {
    let url = `${BASE_URL}/AwsBarGraph/filtered?financialYearId=${financialYearId}`;

    if (departmentId) {
      url += `&departmentId=${departmentId}`;
    }

    const response = await axios.get<Record<string, number>>(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching AwsBarGraph data:", error);
    throw error;
  }
};

// Function to fetch the DuBarGraph data with optional filters
export const fetchDuBarGraphData = async (
  financialYearId: number,
  providerId?: number
) => {
  try {
    let url = `${BASE_URL}/DuBarGraph/filtered?financialYearId=${financialYearId}`;

    if (providerId) {
      url += `&providerId=${providerId}`;
    }

    const response = await axios.get<Record<string, number>>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching DuBarGraph data:", error);
    throw error;
  }
};

// Function to fetch all Financial Years
export const fetchFinancialYears = async (): Promise<FinancialYearLabel[]> => {
  try {
    const response = await axios.get<FinancialYear[]>(
      `${BASE_URL}/FinancialYear/allfinancialyears`
    );
    return response.data.map((year) => ({
      id: year.id,
      label: `${new Date(year.fromDate).getFullYear()}-${new Date(
        year.toDate
      ).getFullYear()}`,
    }));
  } catch (error) {
    console.error("Error fetching Financial Years:", error);
    throw error;
  }
};

// Function to fetch all Departments
export const fetchDepartments = async (): Promise<DepartmentLabel[]> => {
  try {
    const response = await axios.get<Department[]>(
      `${BASE_URL}/Department/allDepartments`
    );
    return response.data
      .filter((department) => department.departmentName !== "L&D") // Filter out L&D department
      .map((department) => ({
        id: department.id,
        label: department.departmentName,
      }));
  } catch (error) {
    console.error("Error fetching Departments:", error);
    throw error;
  }
};

// Function to fetch all Certification Providers
export const fetchCertificationProviders = async (): Promise<
  CertificationProviderLabel[]
> => {
  try {
    const response = await axios.get<CertificationProvider[]>(
      `${BASE_URL}/CertificationProvider/allcertificationproviders`
    );
    return response.data.map((provider) => ({
      id: provider.id,
      label: provider.providerName,
    }));
  } catch (error) {
    console.error("Error fetching Certification Providers:", error);
    throw error;
  }
};
