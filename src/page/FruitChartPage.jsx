import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./FruitChartPage.css";

function FruitChartPage({ data }) {
  return (
    <div className="chart-page">
      <p className="chart-desc">최근 7일 가격 변화 (단위: 원)</p>

      <div className="chart-box">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis
              tickFormatter={(value) => `${value.toLocaleString()}원`}
            />

            <Tooltip
              formatter={(value) => `${value.toLocaleString()}원`}
            />

            <Line
              type="monotone"
              dataKey="price"
              stroke="#4CAF50"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default FruitChartPage;