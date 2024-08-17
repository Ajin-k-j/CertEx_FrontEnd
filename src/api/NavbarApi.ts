import axios from 'axios';

export type Role = 'user' | 'departmentHead' | 'LDAdmin' | 'AWSAdmin';

export interface UserData {
  name: string;
  role: Role;
}

export const fetchUserData = async (): Promise<UserData> => {
  try {
    const response = await axios.get('../../public/Data/userData.json');
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error('Error fetching user data');
  }
};
