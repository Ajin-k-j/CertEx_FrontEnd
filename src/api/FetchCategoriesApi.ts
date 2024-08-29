import apiClient from "./BaseApi";
import axios from "axios";
interface Tag {
  id: string;
  categoryTagName: string;
}

export const fetchCategoriesjson = async (): Promise<Tag[]> => {
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
export const createCategoryjson = async (name: string) => {
  try {
    const response = await axios.post("http://localhost:5000/providers", {
      name,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

//api integration
export const fetchCategories = async (): Promise<Tag[]> => {
  try {
    const response = await apiClient.get<Tag[]>("/CategoryTag/allcategorytags");

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
export const createCategory = async (name: string) => {
  try {
    const response = await apiClient.post("/categories", { name });
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};
