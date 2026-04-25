import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";

const COLORS = ["#101585", "#14b8a6", "#3b82f6", "#f59e0b", "#22c55e"];

export default function AnalyticsPage() {

  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    categoryData: [],
    statusData: [],
  });

  const [loading, setLoading] = useState(true);

  /* 🔐 Admin Protection */
  useEffect(() => {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      navigate("/login", { replace: true });
    }

  }, [navigate]);


  /* 📊 Load Analytics Data From Backend */

  useEffect(() => {

    fetch("http://localhost:5000/api/admin/analytics", {

      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },

    })
      .then((res) => res.json())
      .then((data) => {

        setAnalytics({
          total: data.total || 0,
          pending: data.pending || 0,
          resolved: data.resolved || 0,
          categoryData: data.categoryData || [],
          statusData: data.statusData || [],
        });

        setLoading(false);

      })
      .catch(() => {
        alert("Failed to load analytics");
        setLoading(false);
      });

  }, []);


  if (loading) {
    return (
      <AdminLayout>
        <p className="text-center text-gray-500 text-lg">
          Loading analytics...
        </p>
      </AdminLayout>
    );
  }


  return (

    <AdminLayout>

      <h1 className="text-3xl font-bold text-[#101585] mb-8">
        Analytics Dashboard
      </h1>


      {/* ================= STATS ================= */}

      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <StatCard
          title="Total Complaints"
          value={analytics.total}
        />

        <StatCard
          title="Pending Complaints"
          value={analytics.pending}
        />

        <StatCard
          title="Resolved Complaints"
          value={analytics.resolved}
        />

      </div>



      {/* ================= CHARTS ================= */}

      <div className="grid md:grid-cols-2 gap-8">


        {/* CATEGORY PIE CHART */}

        <div className="bg-white p-6 rounded-2xl shadow-md">

          <h2 className="text-lg font-semibold text-[#101585] mb-4">
            Complaints by Category
          </h2>

          <ResponsiveContainer width="100%" height={320}>

            <PieChart>

              <Pie
                data={analytics.categoryData || []}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >

                {(analytics.categoryData || []).map((_, index) => (

                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />

                ))}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>



        {/* STATUS BAR CHART */}

        <div className="bg-white p-6 rounded-2xl shadow-md">

          <h2 className="text-lg font-semibold text-[#101585] mb-4">
            Complaint Status
          </h2>

          <ResponsiveContainer width="100%" height={320}>

            <BarChart data={analytics.statusData || []}>

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#101585"
                radius={[6, 6, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </AdminLayout>
  );
}



/* ================= STAT CARD ================= */

function StatCard({ title, value }) {

  return (

    <div className="bg-white shadow-md p-6 rounded-2xl text-center">

      <p className="text-3xl font-bold text-[#101585]">
        {value}
      </p>

      <p className="text-gray-500 mt-2">
        {title}
      </p>

    </div>

  );

}