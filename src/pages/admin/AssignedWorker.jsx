
import { useState, useEffect } from "react";

import AdminLayout from "../../components/AdminLayout";

export default function AssignedWorker() {

  
  const [workers, setWorkers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReportIndex, setSelectedReportIndex] = useState(null);
  const [newWorker, setNewWorker] = useState("");
  const [reports, setReports] = useState([]);

  /* ===============================
     LOAD WORKERS FROM DATABASE
  =============================== */
useEffect(() => {
  loadWorkers();
  loadComplaints();
}, []);
  const loadComplaints = async () => {

  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/admin/complaints", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();
  setReports(data);
};
  const loadWorkers = async () => {

    const token = localStorage.getItem("token");

    try {

      const res = await fetch("http://localhost:5000/api/admin/workers", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setWorkers(data);

    } catch (error) {
      console.error("Error loading workers:", error);
    }
  };

  const openReassignDialog = (index) => {
    setSelectedReportIndex(index);
    setNewWorker("");
    setShowModal(true);
  };
const reassignWorker = async () => {

  const token = localStorage.getItem("token");
  const complaint = reports[selectedReportIndex];

  await fetch(
    `http://localhost:5000/api/admin/complaints/${complaint.id}/assign`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        worker_id: newWorker
      })
    }
  );

  loadComplaints();
  setShowModal(false);


};
return (
  <AdminLayout>

    {/* PAGE TITLE */}

    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-[#101585]">
        Assigned Complaints
      </h1>

      <span className="text-sm text-gray-500">
        Total: {reports.length}
      </span>
    </div>


    {/* EMPTY STATE */}

    {reports.length === 0 && (
      <div className="bg-white p-10 rounded-2xl shadow text-center">
        <p className="text-gray-500 text-lg">
          No complaints available
        </p>
      </div>
    )}


    {/* COMPLAINT LIST */}

   <div className="grid md:grid-cols-2 gap-6">

  {reports.map((r, index) => (

    <div
      key={index}
      className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition border"
    >

      {/* Complaint Title */}
      <h2 className="text-lg font-semibold text-[#101585] mb-2">
        {r.issue || r.title}
      </h2>

      {/* Category */}
      <p className="text-sm text-gray-500 mb-2">
        📂 Category: {r.category || "Others"}
      </p>

      {/* 👤 USER DETAILS */}
      <div className="bg-gray-50 p-4 rounded-lg mb-3 border">

        <p className="text-sm text-gray-700">
          👤 <b>Name:</b> {r.customer_name || "Unknown"}
        </p>

        <p className="text-sm text-gray-700">
          📱 <b>Phone:</b> {r.customer_number || "Not Provided"}
        </p>

      </div>

      {/* Worker */}
      <p className="text-sm text-gray-600 mb-3">
        👷 Worker:{" "}
        <span className="font-semibold text-gray-800">
  {r.worker_name ? r.worker_name : "Not Assigned"}
</span>
        
      </p>

      {/* Status */}
     <span
  className={`px-3 py-1 rounded-full text-xs font-semibold
  ${
    r.worker_name
      ? "bg-blue-100 text-blue-700"
      : "bg-red-100 text-red-700"
  }`}
>
  {r.worker_name ? "Assigned" : "Not Assigned"}
</span>

    </div>

  ))}

</div>


   
      



  </AdminLayout>
);
}
