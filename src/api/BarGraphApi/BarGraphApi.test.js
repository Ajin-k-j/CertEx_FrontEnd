import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchCertificationData } from './BarGraphApi';


const mock = new MockAdapter(axios);

describe('fetchCertificationData', () => {
  afterEach(() => {
    mock.reset();
  });

  test('should fetch certification data successfully', async () => {
    const mockData = [{
      year: '2024-2025',
      data: {
        'All': {
          AWS: [1, 2, 3, 4]
        }
      }
    }];

    // Mock the API response
    mock.onGet('/certificationData').reply(200, mockData);

    // Call the function
    const result = await fetchCertificationData();

    // Assertions
    expect(result).toEqual(mockData[0]);
    console.log = jest.fn();
    expect(console.log).toHaveBeenCalledWith("success");
  });

  test('should throw an error if no data is found in the response', async () => {
    // Mock the API response with an empty array
    mock.onGet('/certificationData').reply(200, []);

    // Assertions
    await expect(fetchCertificationData()).rejects.toThrow('No data found.');
    console.error = jest.fn();
    expect(console.error).toHaveBeenCalledWith('No data found in the response.');
  });

  test('should handle network or server errors', async () => {
    // Mock a network error
    mock.onGet('/certificationData').networkError();

    // Assertions
    await expect(fetchCertificationData()).rejects.toThrow();
    console.error = jest.fn();
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error fetching data:'));
  });
});
