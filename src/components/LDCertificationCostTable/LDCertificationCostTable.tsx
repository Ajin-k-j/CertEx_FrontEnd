import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Table from '@mui/joy/Table';
import axios from 'axios';
import { Dialog, DialogContent, DialogTitle, IconButton, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExcelExport from '../ExportButton/ExportButton';

interface MonthlyData {
  Count: number;
  EstimatedCost: number;
  ActualCost: number;
}

interface RowData {
  id: number;
  provider: string;
  FinancialYear: string;
  January: MonthlyData;
  February: MonthlyData;
  March: MonthlyData;
  April: MonthlyData;
  May: MonthlyData;
  June: MonthlyData;
  July: MonthlyData;
  August: MonthlyData;
  September: MonthlyData;
  October: MonthlyData;
  November: MonthlyData;
  December: MonthlyData;
}

export default function LDCertificationCostTable({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [rows, setRows] = useState<RowData[]>([]);
  const [filteredRows, setFilteredRows] = useState<RowData[]>([]);
  const [financialYears, setFinancialYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [grandTotals, setGrandTotals] = useState({ totalCount: 0, totalEstimatedCost: 0, totalActualCost: 0 });

  useEffect(() => {
    axios
      .get('../../../public/Data/CertificationCost.json') // Replace with your actual API endpoint
      .then((response) => {
        if (Array.isArray(response.data)) {
          const data = response.data as RowData[];
          setRows(data);

          const years = Array.from(new Set(data.map(row => row.FinancialYear)));
          setFinancialYears(years);

          const mostRecentYear = years[years.length - 1]; // Assuming years are in ascending order
          setSelectedYear(mostRecentYear);
          filterRowsByYear(data, mostRecentYear);
        } else {
          console.error('API response is not an array:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    filterRowsByYear(rows, selectedYear);
  }, [selectedYear, rows]);

  const filterRowsByYear = (data: RowData[], year: string) => {
    const filtered = data.filter(row => row.FinancialYear === year);
    setFilteredRows(filtered);

    const totals = filtered.reduce(
      (acc, row) => {
        const { totalCount, totalEstimatedCost, totalActualCost } = calculateYearlyTotals(row);
        acc.totalCount += totalCount;
        acc.totalEstimatedCost += totalEstimatedCost;
        acc.totalActualCost += totalActualCost;
        return acc;
      },
      { totalCount: 0, totalEstimatedCost: 0, totalActualCost: 0 }
    );
    setGrandTotals(totals);
  };

  const calculateYearlyTotals = (row: RowData) => {
    let totalCount = 0;
    let totalEstimatedCost = 0;
    let totalActualCost = 0;

    [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ].forEach((month) => {
      const monthlyData = row[month as keyof RowData] as MonthlyData; // Type assertion here
      totalCount += monthlyData.Count;
      totalEstimatedCost += monthlyData.EstimatedCost;
      totalActualCost += monthlyData.ActualCost;
    });

    return { totalCount, totalEstimatedCost, totalActualCost };
  };

  return (
    <Dialog fullScreen open={open} onClose={onClose} fullWidth maxWidth="lg" PaperProps={{ sx: { bgcolor: 'white', marginX: 2, padding: 2 } }}>
      <DialogTitle>
        Detailed Statistics
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', width: '100%', height: 70 }}>
          <FormControl sx={{ minWidth: 200, marginRight: 2 }}>
            <InputLabel>Financial Year</InputLabel>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value as string)}
              label="Financial Year"
            >
              {financialYears.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <ExcelExport data={filteredRows} fileName={'CertificationCost'} />
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ width: '100%', height: '50vh' }}>
          <Sheet
            variant="outlined"
            sx={() => ({
              '--TableCell-height': '40px',
              '--TableHeader-height': 'calc(1 * var(--TableCell-height))',
              '--Table-secondColumnWidth': '150px',
              '--Table-lastColumnWidth': '250px',
              '--TableRow-stripeBackground': 'rgba(0 0 0 / 0.04)',
              '--TableRow-hoverBackground': 'rgba(0 0 0 / 0.08)',
              overflow: 'auto',
              whiteSpace: 'nowrap',
              width: '100%',
              backgroundColor: 'background.surface',
            })}
          >
            <Table
              borderAxis="bothBetween"
              stripe="odd"
              hoverRow
              sx={{
                '& tr > *:first-child': {
                  position: 'sticky',
                  left: 0,
                  zIndex: 10,
                  boxShadow: '1px 0 var(--TableCell-borderColor)',
                  bgcolor: 'background.surface',
                },
                '& tr > *:nth-last-child(3)': {
                  position: 'sticky',
                  right: '178px',
                  bgcolor: 'background.surface',
                  zIndex: 3,
                  overflowX: 'hidden'
                },
                '& tr > *:nth-last-child(2)': {
                  position: 'sticky',
                  right: '88px',
                  bgcolor: 'background.surface',
                  zIndex: 3,
                  overflowX: 'hidden'
                },
                '& tr > *:last-child': {
                  position: 'sticky',
                  right: 0,
                  bgcolor: 'var(--TableCell-headBackground)',
                  overflowX: 'hidden'
                },
                '& thead th': {
                  position: 'sticky',
                  top: 0,
                  backgroundColor: 'background.surface',
                  zIndex: 4,
                  color: 'grey', 
                }
              }}
            >
              <thead>
                <tr>
                  <th style={{ width: 'var(--Table-secondColumnWidth)', color: 'grey' }} rowSpan={2}>Provider</th>
                  {[
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                  ].map((month) => (
                    <th key={month} colSpan={3} style={{ width: 450, textAlign: 'center', color: 'grey' }}>
                      {month}
                    </th>
                  ))}
                  <th aria-label="last" style={{ width: 'var(--Table-lastColumnWidth)', textAlign: 'center', color: 'grey' }} colSpan={3}>Yearly Total</th>
                </tr>
                <tr>
                  {Array.from({ length: 12 }).map((_, index) => (
                    <React.Fragment key={index}>
                      <th style={{ width: 150, zIndex: 2, color: 'grey' }}>Count</th>
                      <th style={{ width: 150, zIndex: 2, color: 'grey' }}>Estimated Cost</th>
                      <th style={{ width: 150, zIndex: 2, color: 'grey' }}>Actual Cost</th>
                    </React.Fragment>
                  ))}
                  <th style={{ width: 'var(--Table-lastColumnWidth)', color: 'grey' }}>Count</th>
                  <th style={{ width: 'var(--Table-lastColumnWidth)', color: 'grey' }}>Estimated Cost</th>
                  <th style={{ width: 'var(--Table-lastColumnWidth)', color: 'grey' }}>Actual Cost</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, index) => (
                  <tr key={index}>
                    <td style={{ position: 'sticky', left: 0, zIndex: 1, backgroundColor: 'white' }}>
                      {row.provider}
                    </td>
                    {[
                      'January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'
                    ].map((month) => {
                      const monthlyData = row[month as keyof RowData] as MonthlyData; // Type assertion here
                      return (
                        <React.Fragment key={month}>
                          <td>{monthlyData.Count || 0}</td>
                          <td>{monthlyData.EstimatedCost || 0}</td>
                          <td>{monthlyData.ActualCost || 0}</td>
                        </React.Fragment>
                      );
                    })}
                    <td style={{ textAlign: 'center' }}>
                      {calculateYearlyTotals(row).totalCount}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {calculateYearlyTotals(row).totalEstimatedCost.toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {calculateYearlyTotals(row).totalActualCost.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td style={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: 'background.surface' }}>Yearly Total</td>
                  {Array.from({ length: 12 * 3 }).map((_, index) => (
                    <td key={index} style={{ textAlign: 'center', backgroundColor: 'background.surface' }}></td>
                  ))}
                  <td style={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: 'background.surface' }}>
                    {grandTotals.totalCount}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: 'background.surface' }}>
                    {grandTotals.totalEstimatedCost.toFixed(2)}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: 'background.surface' }}>
                    {grandTotals.totalActualCost.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </Table>
          </Sheet>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
