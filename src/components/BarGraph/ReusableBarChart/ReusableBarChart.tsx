import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Rectangle,
  TooltipProps,
} from "recharts";

type ReusableBarChartProps = {
  data: { month: string; value: number }[];
  isMobile: boolean;
};

// Custom Tooltip component to remove gray background
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "5px",
          boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p style={{ margin: 0 }}>{`Month: ${label}`}</p>
        <p style={{ margin: 0 }}>{`Value: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const CustomBackground = (props: {
  fill: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}) => {
  const { fill, x, y, width, height } = props;
  return (
    <Rectangle
      fill={fill}
      x={x}
      y={y}
      width={width}
      height={height}
      radius={[10, 10, 10, 10]}
    />
  );
};

const ReusableBarChart: React.FC<ReusableBarChartProps> = ({
  data,
  isMobile,
}) => {
  return (
    <ResponsiveContainer width="100%" height={isMobile ? 200 : "100%"}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="month" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "transparent" }} // Removes the gray background on hover
        />
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
