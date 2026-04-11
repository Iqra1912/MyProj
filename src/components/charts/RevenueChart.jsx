// RevenueChart.jsx - shows line trend chart
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function RevenueChart({ data }) {
  if (!data) return <div className="text-slate-400 text-sm p-4">No data available</div>;

  const chartData = data.labels?.map((label, i) => ({
    name: label,
    value: data.values?.[i] ?? 0
  })) || [];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip formatter={(val) => `$${Number(val).toLocaleString()}`} />
        <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}