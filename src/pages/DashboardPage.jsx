// 
DashboardPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RevenueChart from "../components/charts/RevenueChart";        // ✅ add
import TopProductsChart from "../components/charts/TopProductsChart"; // ✅ add
export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [kpis, setKpis] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetch("/api/dashboard/dashboard", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async () => {
  if (!file) return alert("Please choose a file first");
  //if (data.kpis) setKpis(data.kpis);
  setUploading(true);
  setUploadMsg("");
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    const data = await res.json();
    console.log("kpis:", data.kpis); // ← add this

    // ✅ FIXED: response has charts/insights directly, no dataset_id
    if (data.charts) {
      setUploadMsg("✅ Upload successful!");
      setCharts(data.charts);
      if (data.insights) setInsights(data.insights);
        if (data.kpis) setKpis(data.kpis);
    } else {
      setUploadMsg("❌ " + (data.error || "Upload failed"));
    }
  } catch {
    setUploadMsg("❌ Upload failed");
  } finally {
    setUploading(false);
  }
};

  const fetchKpis = async (datasetId) => {
    const res = await fetch(`/api/dashboard/kpis?dataset_id=${datasetId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.charts) setCharts(data.charts);
    if (data.insights) setInsights(data.insights);
    if (data.revenue !== undefined)
      setStats(prev => ({ ...prev, revenue: data.revenue }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500 text-lg">Loading dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="w-52 bg-slate-900 text-white flex flex-col p-6 gap-6 shrink-0">
        <h2 className="text-xl font-bold">CoreDash</h2>
        <nav className="flex flex-col gap-3 text-sm">
          <span className="text-indigo-400 font-medium">Dashboard</span>
          <span className="text-slate-400 cursor-pointer hover:text-white">Analytics</span>
          <span className="text-slate-400 cursor-pointer hover:text-white">Reports</span>
          <span className="text-slate-400 cursor-pointer hover:text-white">Settings</span>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto text-sm text-red-400 hover:text-red-300 text-left"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-slate-800">System Overview</h1>
          <span className="text-sm text-slate-500">
            {stats?.last_filename && `Last file: ${stats.last_filename}`}
          </span>
        </div>

        
        {/* Upload */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <p className="text-sm font-medium text-slate-700 mb-3">Upload Sales Data</p>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={e => setFile(e.target.files[0])}
              className="text-sm text-slate-600"
            />
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {uploadMsg && <p className="text-sm mt-2">{uploadMsg}</p>}
        </div>

       {/* KPI Cards */}
{kpis.length > 0 ? (
  <div className="grid grid-cols-3 gap-4 mb-8">
    {kpis.map((kpi, idx) => (
      <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{kpi.icon}</span>
          <p className="text-sm text-slate-500">{kpi.label}</p>
        </div>
        <p className="text-2xl font-bold text-indigo-600">{kpi.value}</p>
      </div>
    ))}
  </div>
) : (
  <div className="grid grid-cols-3 gap-4 mb-8">
    {[
      { label: "Total Users", value: stats?.total_users ?? "—", icon: "👥" },
      { label: "Revenue", value: stats?.revenue !== undefined ? `$${Number(stats.revenue).toLocaleString()}` : "—", icon: "💰" },
      { label: "Active Sessions", value: stats?.active_sessions ?? "—", icon: "🟢" },
    ].map(card => (
      <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{card.icon}</span>
          <p className="text-sm text-slate-500">{card.label}</p>
        </div>
        <p className="text-2xl font-bold text-indigo-600">{card.value}</p>
      </div>
    ))}
  </div>
)}


       {/* Charts */}
{charts.length > 0 ? (
  <div className="grid grid-cols-2 gap-6 mb-8">
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <p className="font-medium text-slate-700 mb-4">
        {charts.find(c => c.type === "bar")?.title || "Top Categories"}
      </p>
      <TopProductsChart data={charts.find(c => c.type === "bar")} />
    </div>
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <p className="font-medium text-slate-700 mb-4">
        {charts.find(c => c.type === "line")?.title || "Revenue Trend"}
      </p>
      <RevenueChart data={charts.find(c => c.type === "line")} />  {/* ✅ line not pie */}
    </div>
  </div>
) : (
  <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 mb-8">
    Upload a CSV or Excel file to generate charts
  </div>
)}

        {/* Insights */}
        {insights.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <p className="font-medium text-slate-700 mb-3">Insights</p>
            <ul className="flex flex-col gap-2">
              {insights.map((item, idx) => (
                <li key={idx} className="text-sm text-slate-600">{item}</li>
              ))}
            </ul>
          </div>
        )}

      </main>
    </div>
  );
}