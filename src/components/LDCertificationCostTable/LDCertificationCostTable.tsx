import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Table from '@mui/joy/Table';
import axios from 'axios';
import { TableCell } from '@mui/material';

interface MonthlyData {
  Count: number;
  EstimatedCost: number;
  ActualCost: number;
}

interface RowData {
  id: number;
  provider: string;
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

export default function ScrollableMonthTable() {
  const [rows, setRows] = useState<RowData[]>([]);

  useEffect(() => {
    axios
      .get('../../../public/Data/CertificationCost.json') // Replace with your actual API endpoint
      .then((response) => {
        if (Array.isArray(response.data)) {
          setRows(response.data);
        } else {
          console.error('API response is not an array:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Helper function to calculate totals for each provider
  const calculateYearlyTotals = (row: RowData) => {
    let totalCount = 0;
    let totalEstimatedCost = 0;
    let totalActualCost = 0;

    [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ].forEach((month) => {
      totalCount += row[month as keyof RowData].Count;
      totalEstimatedCost += row[month as keyof RowData].EstimatedCost;
      totalActualCost += row[month as keyof RowData].ActualCost;
    });

    return { totalCount, totalEstimatedCost, totalActualCost };
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography level="body-sm" sx={{ textAlign: 'center', pb: 2 }}>
        ← Scroll horizontally to view all months →
      </Typography>
      <Sheet
        variant="outlined"
        sx={(theme) => ({
          '--TableCell-height': '40px',
          '--TableHeader-height': 'calc(1 * var(--TableCell-height))',
          '--Table-firstColumnWidth': '80px',
          '--Table-secondColumnWidth': '150px', // Width for the Provider column
          '--Table-lastColumnWidth': '250px',
          '--TableRow-stripeBackground': 'rgba(0 0 0 / 0.04)',
          '--TableRow-hoverBackground': 'rgba(0 0 0 / 0.08)',
          overflow: 'auto',
          whiteSpace: 'nowrap',
          background: `linear-gradient(to right, ${theme.vars.palette.background.surface} 30%, rgba(255, 255, 255, 0)),
            linear-gradient(to right, rgba(255, 255, 255, 0), ${theme.vars.palette.background.surface} 70%) 0 100%,
            radial-gradient(
              farthest-side at 0 50%,
              rgba(0, 0, 0, 0.12),
              rgba(0, 0, 0, 0)
            ),
            radial-gradient(
                farthest-side at 100% 50%,
                rgba(0, 0, 0, 0.12),
                rgba(0, 0, 0, 0)
              )
              0 100%`,
          backgroundSize:
            '40px calc(100% - var(--TableCell-height)), 40px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height))',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'local, local, scroll, scroll',
          backgroundPosition:
            'var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height), var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height)',
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
              boxShadow: '1px 0 var(--TableCell-borderColor)',
              bgcolor: 'background.surface',
            },
            '& tr > *:nth-child(2)': {  // Make Provider column sticky
              position: 'sticky',
              left: 'var(--Table-firstColumnWidth)',
              boxShadow: '1px 0 var(--TableCell-borderColor)',
              bgcolor: 'background.surface',
            },
    //        '& tr > *:nth-last-child(3)': {  // Make the third-last column sticky
    //   position: 'sticky',
    //   right: '150px', // Adjust this value to match your column width
    //   bgcolor: 'background.surface',
    //   zIndex: 10, // Ensure this column stays on top
    //   overflowX:'hidden'
    // },
    // '& tr > *:nth-last-child(2)': {  // Make the second-last column sticky
    //   position: 'sticky',
    //   right: '50px', // Adjust this value to match your column width
    //   bgcolor: 'background.surface',
    //   zIndex: 10, // Ensure this column stays on top
    //   overflowX:'hidden'
    // },
            '& tr > *:last-child': {
              position: 'sticky',
              right: 0,
              bgcolor: 'var(--TableCell-headBackground)',
              overflowX:'hidden'
            },
          }}
        >
          <thead>
            {/* Top header row for months */}
            <tr>
              <th style={{ width: 'var(--Table-firstColumnWidth)', zIndex: 10 }} rowSpan={2}>Row</th>
              <th style={{ width: 'var(--Table-secondColumnWidth)', zIndex: 10 }} rowSpan={2}>Provider</th>
              {[
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
              ].map((month) => (
                <th key={month} colSpan={3} style={{ width: 450, textAlign: 'center' }}>
                  {month}
                </th>
              ))}
              <th aria-label="last" style={{ width: 'var(--Table-lastColumnWidth)', zIndex: 10 }} colSpan={3}>Yearly Total</th>
            </tr>
            {/* Second header row for Count, Estimated Cost, Actual Cost */}
            <tr>
              {Array.from({ length: 12 }).map((_, index) => (
                <>
                  <th key={`count-${index}`} style={{ width: 150 }}>Count</th>
                  <th key={`estimated-cost-${index}`} style={{ width: 150 }}>Estimated Cost</th>
                  <th key={`actual-cost-${index}`} style={{ width: 150 }}>Actual Cost</th>
                </>
              ))}
              <th style={{ width: 'var(--Table-lastColumnWidth)',color:'red'}}>Total Count</th>
              <th style={{ width: 83 }}>Total Estimated</th>
              <th style={{ width: 83 }}>Total Actual</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const { totalCount, totalEstimatedCost, totalActualCost } = calculateYearlyTotals(row);

              return (
                <tr key={index}>
                  <td>{row.id}</td>
                  <td>{row.provider}</td>
                  {/* Render data for each month with the new structure */}
                  {[
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                  ].map((month) => (
                    <>
                      <td key={`${month}-count`}>{row[month as keyof RowData].Count}</td>
                      <td key={`${month}-estimated-cost`}>{row[month as keyof RowData].EstimatedCost}</td>
                      <td key={`${month}-actual-cost`}>{row[month as keyof RowData].ActualCost}</td>
                    </>
                  ))}
                  {/* Yearly totals */}
                  <td>{totalCount}</td>
                  <td>{totalEstimatedCost}</td>
                  <td>{totalActualCost}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Sheet>
    </Box>
  );
}
