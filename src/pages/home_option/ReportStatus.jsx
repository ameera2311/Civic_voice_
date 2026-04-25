import { useState } from "react";
import BackArrow from "../../components/backArrow";
export default function ReportStatus() {
  const [complaintId, setComplaintId] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    // 🔹 Clean the complaint ID
    const cleanedId = complaintId
      .toUpperCase()
      .replace(/\s+/g, "")
      .trim();

    if (!cleanedId) {
      setError("Please enter your Complaint ID");
      return;
    }

    setLoading(true);
    setError("");
    setReport(null);

    try {
      const res = await fetch(
        "http://localhost:5000/api/complaints/track",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ complaintId: cleanedId }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Complaint not found");
      }

      setReport(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
return (
  <div className="min-h-screen bg-linear-to-br from-[#f8fbff] to-[#e6f4f4] flex items-center justify-center p-6">
    <BackArrow />
    <div className="w-full max-w-2xl bg-white p-10 rounded-3xl shadow-xl border border-gray-200">

      {/* 🔍 HEADER */}
      <h2 className="text-3xl font-bold text-center text-[#101585] mb-2">
        Track Your Complaint
      </h2>
      <p className="text-center text-gray-500 mb-8">
        Enter your complaint ID to check its status
      </p>

      {/* 🔎 SEARCH SECTION */}
      {!report && (
        <>
          <input
            type="text"
            placeholder="CVC-482917"
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
            className="w-full p-4 rounded-xl border border-gray-300 
                       focus:outline-none focus:ring-2 focus:ring-[#008080] uppercase mb-6"
          />

          <button
            onClick={handleTrack}
            className="w-full bg-[#101585] hover:bg-[#0c1266] 
                       text-white p-4 rounded-xl font-semibold transition shadow-md"
          >
            Check Status
          </button>

          {loading && (
            <p className="mt-4 text-center text-gray-500">
              Checking complaint details...
            </p>
          )}

          {error && (
            <p className="mt-4 text-center text-red-500 font-medium">
              {error}
            </p>
          )}
        </>
      )}

      {/* 📄 RESULT SECTION */}
      {report && (
        <div className="mt-8 border-t border-gray-200 pt-8">

          <h3 className="text-2xl font-bold text-[#101585] mb-4">
            {report.title}
          </h3>

          {/* Status Badge */}
          <div className="mb-6">
            <span className={
              report.status === "Resolved"
                ? "bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold"
                : report.status === "Rejected"
                ? "bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold"
                : "bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold"
            }>
              {report.status}
            </span>
          </div>

          <div className="space-y-3 text-gray-700 text-sm">
            <p><b>Complaint ID:</b> {report.complaint_id}</p>
            <p><b>Name:</b> {report.customer_name}</p>
            <p><b>Phone:</b> {report.customer_number}</p>
            <p><b>Category:</b> {report.category}</p>
            <p><b>Urgency:</b> {report.urgency}</p>
            <p><b>Location:</b> {report.manual_location}</p>
            <p><b>Reported Date:</b> {new Date(report.created_at).toLocaleString()}</p>
          </div>

          <button
            onClick={() => {
              setReport(null);
              setComplaintId("");
              setError("");
            }}
            className="mt-8 w-full border border-[#101585] 
                       text-[#101585] hover:bg-[#101585] hover:text-white 
                       p-3 rounded-xl transition"
          >
            Track Another Complaint
          </button>
        </div>
      )}

    </div>
  </div>
);
 
}
