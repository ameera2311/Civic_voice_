import { useNavigate } from "react-router-dom";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-[#101585] text-white p-6 flex flex-col">

        <h1 className="text-2xl font-bold mb-10">
          Civic Voice
        </h1>

        <nav className="flex flex-col gap-3">

          <button
            onClick={() => navigate("/admin")}
            className="text-left px-4 py-2 rounded hover:bg-blue-800"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/analytics")}
            className="text-left px-4 py-2 rounded hover:bg-blue-800"
          >
            Analytics
          </button>

          {/* <button
            onClick={() => navigate("/admin/assign-worker")}
            className="text-left px-4 py-2 rounded hover:bg-blue-800"
          >
            Assign Worker
          </button>  */}

          <button
            onClick={() => navigate("/admin/assigned-workers")}
            className="text-left px-4 py-2 rounded hover:bg-blue-800"
          >
            Assigned Workers
          </button>

          <button
            onClick={() => navigate("/admin/workers")}
            className="text-left px-4 py-2 rounded hover:bg-blue-800"
          >
            Worker Management
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            className="text-left px-4 py-2 rounded hover:bg-red-600 mt-6"
          >
            Logout
          </button>

        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>

    </div>
  );
}