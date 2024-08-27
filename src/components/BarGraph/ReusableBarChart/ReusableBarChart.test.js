import React from 'react';
import { render, screen } from '@testing-library/react';
import ReusableBarChart from './ReusableBarChart';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

describe('ReusableBarChart', () => {
  const mockData = [
    { month: 'Jan', value: 100 },
    { month: 'Feb', value: 200 },
    { month: 'Mar', value: 300 },
  ];

  test('renders the bar chart with correct data', () => {
    render(<ReusableBarChart data={mockData} isMobile={false} />);

    // Check if BarChart, Bar, XAxis, YAxis, and Tooltip components are rendered
    expect(screen.getByText('Jan')).toBeInTheDocument();
    expect(screen.getByText('Feb')).toBeInTheDocument();
    expect(screen.getByText('Mar')).toBeInTheDocument();
  });

  test('renders the custom tooltip on hover', () => {
    const { container } = render(<ReusableBarChart data={mockData} isMobile={false} />);

    // Trigger a hover event on the first bar
    const bar = container.querySelector('.recharts-bar-rectangle'); 
    expect(bar).toBeInTheDocument();
    
    if (bar) {
      bar.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    }

    // Tooltip content should be displayed
    expect(screen.getByText('Month: Jan')).toBeInTheDocument();
    expect(screen.getByText('Value: 100')).toBeInTheDocument();
  });

  test('adjusts bar size for mobile view', () => {
    const { container } = render(<ReusableBarChart data={mockData} isMobile={true} />);
    
    const bar = container.querySelector('.recharts-bar-rectangle'); 
    expect(bar).toHaveAttribute('height', '200'); // Example check for mobile bar height
  });

  test('renders correctly in mobile view', () => {
    render(<ReusableBarChart data={mockData} isMobile={true} />);

    // Check that the chart has the correct height for mobile view
    const chart = screen.getByTestId('recharts-responsive-container');
    expect(chart).toHaveAttribute('height', '200');
  });

  test('renders custom background with rounded corners', () => {
    const { container } = render(<ReusableBarChart data={mockData} isMobile={false} />);
    
    const backgroundRects = container.querySelectorAll('path');
    backgroundRects.forEach((rect) => {
      expect(rect).toHaveAttribute('rx', '10'); // Check that the radius is applied
    });
  });
});

