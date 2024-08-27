import React from 'react';
import AWSAdminBarGraph from '.AWSAdminBarGraph'
import * as api from '../../../api/BarGraphApi';
import * as fetchDUApi from '../../../api/FetchingDUApi';
import * as fetchFinancialYearApi from '../../../api/FetchFinancialYearApi';
import { render, screen, waitFor } from '@testing-library/react';

jest.mock('../../../api/BarGraphApi');
jest.mock('../../../api/FetchingDUApi');
jest.mock('../../../api/FetchFinancialYearApi');

describe('AWSAdminBarGraph', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(<AWSAdminBarGraph />);
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  test('renders error state if fetch fails', async () => {
    api.fetchCertificationData.mockRejectedValueOnce(new Error('Failed to fetch'));
    render(<AWSAdminBarGraph />);

    await waitFor(() => {
      expect(screen.getByText(/something went wrong while fetching./i)).toBeInTheDocument();
    });
  });

  test('renders no data state if no certification data', async () => {
    api.fetchCertificationData.mockResolvedValueOnce({});
    fetchDUApi.fetchDU.mockResolvedValueOnce(['DU1', 'DU2']);
    fetchFinancialYearApi.fetchFinancialYears.mockResolvedValueOnce([{ from_date: '2023', to_date: '2024' }]);

    render(<AWSAdminBarGraph />);

    await waitFor(() => {
      expect(screen.getByText(/no certification completed yet./i)).toBeInTheDocument();
    });
  });

  test('renders bar chart with data', async () => {
    const mockData = {
      All: {
        All: {
          AWS: [5, 10, 15, 20],
        },
      },
    };
    api.fetchCertificationData.mockResolvedValueOnce(mockData);
    fetchDUApi.fetchDU.mockResolvedValueOnce(['DU1', 'DU2']);
    fetchFinancialYearApi.fetchFinancialYears.mockResolvedValueOnce([{ from_date: '2023', to_date: '2024' }]);

    render(<AWSAdminBarGraph />);

    await waitFor(() => {
      expect(screen.getByText(/apr/i)).toBeInTheDocument(); // Example for checking if the bar chart renders
    });
  });
});
