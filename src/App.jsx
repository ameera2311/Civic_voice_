import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/starting_page/LandingPage";

/* ---------- Auth ---------- */
import Login from "./pages/auth_page/Login";
import SignUp from "./pages/auth_page/SignUp";
import ForgotPassword from "./pages/auth_page/ForgotPassword";

/* ---------- Home ---------- */
import HomePage from "./pages/home/Homepage";

/* ---------- Home Options ---------- */
import ReportIssuePage from "./pages/home_option/ReportIssue";
import ReportStatusPage from "./pages/home_option/ReportStatus";
import ChatWithUsPage from "./pages/home_option/ChatWithUs";
import MyReportPage from "./pages/home_option/MyReport";


/* ---------- Admin ---------- */
import AdminPage from "./pages/admin/AdminPage";
import AnalyticsPage from "./pages/admin/Analytics";
import AssignWorkerPage from "./pages/admin/AssignWorker";
import AssignedWorkerPage from "./pages/admin/AssignedWorker";
import WorkerManagementPage from "./pages/admin/WorkerManagement";

/* ---------- Auth Helper ---------- */
const isLoggedIn = () => {
  return localStorage.getItem("userPhone");
};

/* ---------- Optional: 404 ---------- */
function NotFound() {
  return (
    <div className="text-center mt-20 text-xl">
      404 | Page Not Found
    </div>
  );
}

export default function App() {
  return (
    <Routes>

      {/* ---------- Entry Point ---------- */}
      <Route path="/" element={<LandingPage />} />

<Route path="/admin-login" element={<Login />} />

      
      {/* ---------- Auth ---------- */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ---------- User ---------- */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/report-issue" element={<ReportIssuePage />} />
      <Route path="/home/chat-with-us" element={<ChatWithUsPage />} />
      <Route path="/home/my-reports" element={<MyReportPage />} />
      <Route path="/home/report-status" element={<ReportStatusPage />} />
      

      {/* ---------- Admin ---------- */}
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/analytics" element={<AnalyticsPage />} />
      <Route path="/admin/assign-worker" element={<AssignWorkerPage />} />
      <Route path="/admin/assigned-workers" element={<AssignedWorkerPage />} />
      <Route path="/admin/workers" element={<WorkerManagementPage />} />

      {/* ---------- Fallback ---------- */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}
