import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Rectangle,
} from 'recharts';

type ReusableBarChartProps = {
  data: { month: string; value: number }[];
  isMobile: boolean;
};

const CustomBackground = (props: {
  fill: string;
  x: number;
  y: number;
  width: number;
  height: number;
}) => {
  const { fill, x, y, width, height } = props;
  return (
    <Rectangle
      fill={fill}
      x={x}
      y={y}
      width={width}
      height={height}
      radius={10}
    />
  );
};

const ReusableBarChart: React.FC<ReusableBarChartProps> = ({ data, isMobile }) => {
  return (
    <ResponsiveContainer width="100%" height={isMobile ? 200 : '100%'}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="month" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} />
        <Tooltip />
        <Bar
          dataKey="value"
          fill="#1B59F8"
          background={<CustomBackground fill="#e0e0e0" />}
          barSize={isMobile ? 12 : 15}
          radius={[10, 10, 10, 10]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ReusableBarChart;
