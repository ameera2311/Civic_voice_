import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Homepage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");

    if (!storedUsername) {
      navigate("/login", { replace: true });
      return;
    }

    setUsername(storedUsername);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  const homeText = [
    "Report Issue",
    "Track Complaint",
    "My Complaints",
    "Query Your Doubts",
    "Chat with Us",
    "Nearby Govt Office",
  ];

  const icons = [
    "/assets/home_icon/report.svg",
    "/assets/home_icon/track.svg",
    "/assets/home_icon/my_reports.svg",
    "/assets/home_icon/query.svg",
    "/assets/home_icon/chat_with_us.svg",
    "/assets/home_icon/near_by.svg",
  ];

  const handleNavigate = (index) => {
    switch (index) {
      case 0:
        navigate("/report-issue");
        break;
      case 1:
        navigate("/home/report-status");
        break;
      case 2:
        navigate("/home/my-reports");
        break;
      case 3:
        navigate("/home/chat-with-us");
        break;
      default:
        alert("Feature coming soon");
    }
  };

  return (
    <div className="min-h-screen 
      bg-linear-to-br from-[#f8fbff] to-[#e6f4f4]">

      {/* 🔹 Top Navbar */}
      <header className="sticky top-0 z-10 
        bg-white/80 backdrop-blur border-b border-gray-200">

        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">

          <div>
            <h1 className="text-2xl font-bold text-[#101585]">
              Welcome, {username} 👋
            </h1>
            <p className="text-sm text-gray-500">
              Citizen Help Desk — Report • Track • Resolve
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-lg 
              border border-[#101585] 
              text-[#101585] 
              hover:bg-[#101585] 
              hover:text-white 
              transition"
          >
            Logout
          </button>

        </div>
      </header>

      {/* 🔹 Dashboard Section */}
      <main className="max-w-6xl mx-auto px-6 py-12">

        <h2 className="text-3xl font-bold text-center text-[#101585] mb-2">
          Civic Services Portal
        </h2>

        <p className="text-center text-gray-600 mb-12">
          Your voice matters. Submit and track civic complaints efficiently.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
          {homeText.map((text, index) => (
            <div
              key={index}
              onClick={() => handleNavigate(index)}
              className="cursor-pointer 
                rounded-2xl 
                bg-white 
                p-8
                flex flex-col items-center justify-center text-center
                shadow-md 
                border border-gray-200
                transition 
                hover:-translate-y-2 
                hover:shadow-xl"
            >
              <div className="w-16 h-16 rounded-full 
                bg-[#008080]/10 
                flex items-center justify-center mb-5">

                <img
                  src={icons[index]}
                  alt={text}
                  className="w-8 h-8"
                />
              </div>

              <p className="font-semibold text-[#101585] text-sm">
                {text}
              </p>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}