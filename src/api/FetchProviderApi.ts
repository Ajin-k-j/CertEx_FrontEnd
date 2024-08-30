import apiClient from "./BaseApi";
import axios from "axios";
interface Provider {
  id: string;
  providerName: string;
}

export const fetchProvidersjson = async (): Promise<Provider[]> => {
  try {
    const response = await axios.get("http://localhost:5000/providers");

    // Accessing the providers property if it exists
    if (response.data) {
      return response.data;
    } else {
      throw new Error("Providers property not found in response");
    }
  } catch (error) {
    console.error("Error fetching providers:", error);
    throw new Error("Failed to fetch Providers");
  }
};

export const createProviderjson = async (name: string) => {
  try {
    const response = await axios.post("http://localhost:5000/providers", {
      name,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating provider:", error);
    throw error;
  }
};

//for api integration
export const fetchProviders = async (): Promise<Provider[]> => {
  try {
    const response = await apiClient.get<Provider[]>(
      "/CertificationProvider/allcertificationproviders"
    );

    // Accessing the providers property if it exists
    if (response.data) {
      return response.data;
    } else {
      throw new Error("Providers property not found in response");
    }
  } catch (error) {
    console.error("Error fetching providers:", error);
    throw new Error("Failed to fetch Providers");
  }
};

export const createProvider = async (name: string) => {
  try {
    const response = await apiClient.post("/providers", { name });
    return response.data;
  } catch (error) {
    console.error("Error creating provider:", error);
    throw error;
  }
};
