import React from "react";
import {
  PieChart,
  Pie,
  Sector,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { convertDataChart } from "../../utils";

const PieChartComponent = (props) => {
  const data = convertDataChart(props.data, "paymentMethod");
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex gap-3 flex-col">
        <div className="flex gap-2 items-center">
          <div className=" w-3 h-3 bg-[#0088FE]"></div>
          <p>Thanh toán khi nhận hàng</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className=" w-3 h-3 bg-[#00C49F] "></div>
          <p> Paypal</p>
        </div>
      </div>
      <p className="text-center italic mt-2">Sơ đồ thanh toán</p>
    </>
  );
};

export default PieChartComponent;
