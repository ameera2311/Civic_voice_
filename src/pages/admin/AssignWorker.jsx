import { useEffect, useState } from "react";
import { getFullAddress } from "../../service/geocodingService";
import AdminLayout from "../../components/AdminLayout";

export default function AssignWorker() {

  const [reports, setReports] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedReportIndex, setSelectedReportIndex] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [detectedArea, setDetectedArea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  /* =========================================
     LOAD COMPLAINTS + WORKERS FROM BACKEND
  ========================================= */
  useEffect(() => {

    loadComplaints();
    loadWorkers();

  }, []);

  const loadComplaints = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/admin/complaints", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  setReports(data);
};

const loadWorkers = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/admin/workers", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  setWorkers(data);
};

  /* =========================================
     HANDLE REPORT SELECT
  ========================================= */
  const handleReportChange = async (index) => {

    setSelectedReportIndex(index);
    setDetectedArea("");
    setSuccessMsg("");
    setIsLoading(true);

    const report = reports[index];

    if (report?.latitude && report?.longitude) {

      const area = await getFullAddress(report.latitude, report.longitude);
      setDetectedArea(area);

    } else if (report?.manual_location) {

      setDetectedArea(report.manual_location);

    } else {

      setDetectedArea("Location not available");

    }

    setIsLoading(false);

  };


  /* =========================================
     ASSIGN WORKER
  ========================================= */
  const assignWorker = async () => {

    if (selectedReportIndex === null || !selectedWorker) return;

    const complaint = reports[selectedReportIndex];

    try {

      const res = await fetch(
        `http://localhost:5000/api/admin/complaints/${complaint.id}/assign`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            workerId: selectedWorker
          })
        }
      );

      const data = await res.json();

      if (res.ok) {

        setSuccessMsg("✅ Worker assigned successfully");

        loadComplaints();

      } else {

        alert(data.message);

      }

    } catch (err) {

      console.error(err);
      alert("Worker assignment failed");

    }

    setSelectedWorker("");

  };


  return (

  <AdminLayout>

    <div className="max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold text-[#101585] mb-8">
        Assign Worker
      </h1>


      {successMsg && (
        <div className="bg-green-100 text-green-700 p-4 rounded-xl mb-6 shadow">
          {successMsg}
        </div>
      )}


      <div className="grid md:grid-cols-2 gap-6">


        {/* ================= SELECT COMPLAINT ================= */}

        <div className="bg-white p-6 rounded-2xl shadow-md border">

          <h2 className="text-lg font-semibold text-[#101585] mb-4 flex items-center gap-2">
            📋 Select Complaint
          </h2>

          <select
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#101585]"
            defaultValue=""
            onChange={(e) => handleReportChange(Number(e.target.value))}
          >

            <option value="">
              Select Complaint
            </option>

            {reports.map((r, i) => (

              <option key={r.id || i} value={i}>
                {r.issue || r.title} — {r.category}
              </option>

            ))}

          </select>

        </div>



        {/* ================= SELECT WORKER ================= */}

        <div className="bg-white p-6 rounded-2xl shadow-md border">

          <h2 className="text-lg font-semibold text-[#101585] mb-4 flex items-center gap-2">
            👷 Select Worker
          </h2>

          <select
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#101585]"
            value={selectedWorker}
            onChange={(e) => setSelectedWorker(e.target.value)}
          >

            <option value="">
              Select Worker
            </option>

            {workers.map((w) => (

              <option key={w.id} value={w.id}>
                {w.name} — {w.department}
              </option>

            ))}

          </select>

        </div>

      </div>



      {/* ================= LOCATION ================= */}

      {isLoading && (
        <div className="text-gray-500 mt-6 text-center">
          Detecting location...
        </div>
      )}

      {!isLoading && detectedArea && (

        <div className="bg-green-50 border border-green-200 p-5 rounded-xl mt-6 shadow-sm">

          <span className="font-semibold text-green-700 flex items-center gap-2">
            📍 Detected Area
          </span>

          <p className="text-gray-700 mt-1">
            {detectedArea}
          </p>

        </div>

      )}



      {/* ================= ASSIGN BUTTON ================= */}

      <div className="mt-8">

        <button
          disabled={selectedReportIndex === null || !selectedWorker}
          onClick={assignWorker}
          className={`w-full py-4 rounded-xl text-white text-lg font-semibold transition shadow-md
          ${
            selectedReportIndex !== null && selectedWorker
              ? "bg-[#101585] hover:bg-blue-800"
              : "bg-blue-800 cursor-not-allowed"
          }`}
        >
          Assign Worker
        </button>

      </div>

    </div>

  </AdminLayout>

);
}
