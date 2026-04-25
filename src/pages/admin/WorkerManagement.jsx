
import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";

export default function WorkerManagement() {

  const [workers, setWorkers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");

  const [successMsg, setSuccessMsg] = useState("");

  /* ================================
     LOAD WORKERS FROM DATABASE
  =================================*/
  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    try {

      const token = localStorage.getItem("token");

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

  /* ================================
     OPEN ADD WORKER MODAL
  =================================*/
  const openModal = () => {
    setName("");
    setPhone("");
    setDepartment("");
    setShowModal(true);
  };

  /* ================================
     ADD WORKER
  =================================*/
  const handleAddWorker = async () => {

    if (!name || !phone || !department) {
      alert("⚠️ All fields are required");
      return;
    }

    try {

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/admin/workers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          phone,
          department
        })
      });

      const data = await res.json();

      if (res.ok) {

        loadWorkers();

        setShowModal(false);

        setSuccessMsg("✅ Worker added successfully");

        setTimeout(() => {
          setSuccessMsg("");
        }, 3000);

      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  /* ================================
     DELETE WORKER
  =================================*/
  const handleDelete = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await fetch(`http://localhost:5000/api/admin/workers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      loadWorkers();

    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (

    <AdminLayout>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold text-[#101585]">
          Worker Management
        </h1>

        <button
          onClick={openModal}
          className="bg-[#101585] text-white px-5 py-2 rounded-lg shadow hover:bg-blue-900"
        >
          ➕ Add Worker
        </button>

      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
          {successMsg}
        </div>
      )}

      {/* Worker List */}
      {workers.length === 0 ? (

        <div className="text-center text-gray-500 mt-20">
          No workers available
        </div>

      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {workers.map((w) => (

            <div
              key={w.id}
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex justify-between items-start"
            >

              <div>

                <div className="w-10 h-10 rounded-full bg-[#101585] text-white flex items-center justify-center font-bold mb-3">
                  {w.name.charAt(0)}
                </div>

                <h2 className="text-lg font-bold text-[#101585]">
                  {w.name}
                </h2>

                <p className="text-gray-600 text-sm mt-1">
                  📞 {w.phone}
                </p>

                <p className="text-gray-600 text-sm">
                  🏢 {w.department}
                </p>

              </div>

              <button
                onClick={() => handleDelete(w.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>

            </div>

          ))}

        </div>

      )}

      {/* Add Worker Modal */}
      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">

            <h2 className="text-xl font-bold text-[#101585] mb-4">
              Add New Worker
            </h2>

            <input
              className="w-full p-3 border rounded-lg mb-3"
              placeholder="Worker Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="w-full p-3 border rounded-lg mb-3"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              className="w-full p-3 border rounded-lg mb-5"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleAddWorker}
                className="px-4 py-2 bg-[#101585] text-white rounded-lg hover:bg-blue-900"
              >
                Add Worker
              </button>

            </div>

          </div>

        </div>

      )}

    </AdminLayout>
  );
}

