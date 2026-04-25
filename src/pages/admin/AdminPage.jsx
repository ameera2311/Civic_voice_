import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { useNavigate } from "react-router-dom";

const categories = ["Water", "Roads", "Electricity", "Waste", "Others"];

export default function AdminPage() {
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Water");

  const navigate = useNavigate();

  /* 🔐 Admin Protection */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  /* 📥 Load Complaints */
  useEffect(() => {
    fetch("http://localhost:5000/api/admin/complaints", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load complaints");
        return res.json();
      })
      .then((data) => setReports(data))
      .catch(() => alert("Failed to load complaints"));
  }, []);

  /* 🔄 Update Status */
  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/admin/complaints/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      });

      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } catch {
      alert("Failed to update status");
    }
  };

  /* 🗑 Delete Complaint */
  const deleteReport = async (id) => {
    if (!window.confirm("Delete complaint?")) return;

    try {
      await fetch(`http://localhost:5000/api/admin/complaints/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("Failed to delete complaint");
    }
  };

  /* 🔍 Filtering */
  const filteredReports = reports.filter(
    (r) =>
      r.category?.toLowerCase() === activeTab.toLowerCase() &&
      JSON.stringify(r).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = reports.filter((r) => r.status !== "Resolved").length;
  const resolvedCount = reports.filter((r) => r.status === "Resolved").length;

  return (
    <AdminLayout>

      <h1 className="text-3xl font-bold text-[#101585] mb-8">
        Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <StatCard title="Total Complaints" value={reports.length} />
        <StatCard title="Pending Complaints" value={pendingCount} />
        <StatCard title="Resolved Complaints" value={resolvedCount} />

      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search complaints..."
        className="w-full mb-8 p-3 border rounded-xl focus:ring-2 focus:ring-[#101585]"
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Category Tabs */}
      <div className="flex gap-4 mb-8 flex-wrap">

        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveTab(c)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition
            ${
              activeTab === c
                ? "bg-[#101585] text-white"
                : "bg-white border text-gray-600"
            }`}
          >
            {c}
          </button>
        ))}

      </div>

      {/* Complaint List */}
      <div className="space-y-6">

        {filteredReports.map((r) => (
          <div
            key={r.id}
            className="bg-white p-6 rounded-2xl shadow flex justify-between items-center flex-wrap gap-4"
          >

            <div>

              <h2 className="text-lg font-semibold text-[#101585]">
                {r.issue || r.title}
              </h2>

              <p className="text-sm text-gray-500">
                {r.customer_name}
              </p>

              <span
                className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold
                ${
                  r.status === "Resolved"
                    ? "bg-green-100 text-green-700"
                    : r.status === "Accepted"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {r.status}
              </span>

            </div>

            <div className="flex gap-3">

              <button
                onClick={() => updateStatus(r.id, "Accepted")}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Accept
              </button>

              <button
                onClick={() => updateStatus(r.id, "Resolved")}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Resolve
              </button>

            

            </div>

          </div>
        ))}

        {filteredReports.length === 0 && (
          <p className="text-gray-500 text-center">
            No complaints found
          </p>
        )}

      </div>

    </AdminLayout>
  );
}


/* Stat Card Component */

function StatCard({ title, value }) {
  return (
    <div className="bg-white shadow-md p-6 rounded-2xl text-center">
      <h2 className="text-3xl font-bold text-[#101585]">
        {value}
      </h2>
      <p className="text-gray-500 mt-2">
        {title}
      </p>
    </div>
  );
}