// src/components/charts/TopProductsChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function TopProductsChart({ data }) {
  if (!data) return <div className="text-slate-400 text-sm">No bar chart data</div>;

  const chartData = data.labels?.slice(0, 10).map((label, i) => ({
  name: label,
  value: data.values?.[i] ?? 0
  })) || [];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip />
        <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}