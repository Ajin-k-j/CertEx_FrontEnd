import axios from 'axios';
import { RowData } from '../types/LdNominations.types';
import { parse } from 'date-fns';

export const fetchLDNominationData = async (): Promise<RowData[]> => {
  try {
    const response = await axios.get('../../../public/Data/LDNominationData.json'); //https://localhost:7209/api/LDNomination,//../../../public/Data/LDNominationData.json
    const data = response.data;

    if (Array.isArray(data)) {
      return data.map((row: RowData) => ({
        ...row,
        nominationDate: typeof row.examDate === 'string' ? parseDate(row.examDate) : row.examDate,
        examDate: typeof row.examDate === 'string' ? parseDate(row.examDate) : row.examDate,
      }));
    } else {
      throw new Error('Data is not in expected array format');
    }
  } catch (error) {
    throw new Error("Failed to load data");
  }
};

const parseDate = (dateString: string) => {
  return parse(dateString, 'yyyy-MM-dd', new Date());
};
