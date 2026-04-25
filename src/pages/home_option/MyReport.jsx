import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackArrow from "../../components/BackArrow";
export default function MyReport() {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again");
      navigate("/login");
      return;
    }

    fetch("http://localhost:5000/api/complaints/my", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setReports(data);
      })
      .catch((err) => {
        console.error("Error fetching reports:", err);
      });
  }, [navigate]);

  const deleteReport = async (id) => {
    const token = localStorage.getItem("token");

    if (!window.confirm("Delete this complaint?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/complaints/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // 🔎 Filter Logic
  const filteredReports =
    filter === "All"
      ? reports
      : reports.filter((r) => r.status === filter);

 return (

<div className="min-h-screen bg-linear-to-br from-[#f8fbff] to-[#e6f4f4] py-12 px-6">

  <BackArrow />

  <div className="max-w-6xl mx-auto">

    {/* PAGE HEADER */}
    <div className="text-center mb-10">
      <h1 className="text-4xl font-bold text-[#101585] mb-2">
        My Reports
      </h1>
      <p className="text-gray-500">
        Track all complaints you have submitted
      </p>
    </div>


    {/* EMPTY STATE */}
    {filteredReports.length === 0 ? (

      <div className="bg-white p-12 rounded-3xl shadow-lg border text-center">

        <div className="text-5xl mb-4">📭</div>

        <p className="text-gray-500 text-lg">
          You have not submitted any complaints yet
        </p>

      </div>

    ) : (

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">

        {filteredReports.map((r) => (

          <div
            key={r.id}
            className="bg-white p-8 rounded-3xl shadow-md border border-gray-200
                       hover:shadow-xl hover:-translate-y-1 transition duration-300"
          >

            {/* TITLE */}
            <div className="flex justify-between items-start mb-4">

              <h2 className="text-xl font-bold text-[#101585]">
                {r.title}
              </h2>

              {/* URGENCY BADGE */}
              <span
                className={`px-3 py-1 text-xs rounded-full font-semibold
                ${
                  r.urgency === "High"
                    ? "bg-red-100 text-red-700"
                    : r.urgency === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {r.urgency}
              </span>

            </div>


            {/* COMPLAINT ID */}
            <p className="text-sm text-gray-500 mb-4">
              Complaint ID :
              <span className="font-semibold text-gray-700 ml-1">
                {r.complaint_id}
              </span>
            </p>


            {/* DETAILS */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm text-gray-700">

              <p>📞 <b>Phone:</b> {r.phone}</p>

              <p>
                📅 <b>Date:</b>{" "}
                {new Date(r.created_at).toLocaleDateString()}
              </p>

            </div>


            {/* ACTION BUTTONS */}
            <div className="flex gap-4 mt-6">

              <button
                onClick={() =>
                  navigate("/home/report-status", { state: r })
                }
                className="flex-1 bg-[#008080] hover:bg-[#006666]
                           text-white py-2.5 rounded-xl font-medium
                           transition shadow"
              >
                View
              </button>

              <button
                onClick={() => deleteReport(r.id)}
                className="flex-1 border border-red-500 text-red-500
                           hover:bg-red-500 hover:text-white
                           py-2.5 rounded-xl font-medium
                           transition"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    )}

  </div>

</div>
);
}