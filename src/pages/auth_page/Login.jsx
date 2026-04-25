import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /* =========================================
     Auto Redirect If Already Logged In
  ========================================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    }
  }, [navigate]);

  /* =========================================
     Handle Login
  ========================================= */
  const handleLogin = async () => {
    if (!email || !password) {
      alert("⚠️ Please enter all fields");
      return;
    }

    try {
      setLoading(true);

      let loginUrl = "http://localhost:5000/api/login";

      if (email === "admin@civicvoice.gov") {
        loginUrl = "http://localhost:5000/api/admin/login";
      }

      const res = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);

      if (data.role === "admin") {
        localStorage.setItem("role", "admin");
        alert("✅ Admin logged in successfully");
        navigate("/admin", { replace: true });
      } else if (data.user) {
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("userEmail", data.user.email);

        alert(`✅ Welcome ${data.user.username}`);
        navigate("/home", { replace: true });
      } else {
        throw new Error("Invalid login response");
      }
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4
      bg-linear-to-br from-[#f8fbff] to-[#e6f4f4]">

      {/* Card */}
      <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl 
        w-full max-w-md p-10 border border-gray-200">

        <h2 className="text-3xl font-bold text-[#101585] mb-6 text-center">
          Welcome Back
        </h2>

        {/* Email */}
        <Input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            className="absolute right-4 top-3 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-6 bg-[#101585] hover:bg-[#0d116b]
          text-white py-3 rounded-xl text-lg font-semibold transition shadow-md"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Signup Link */}
        <div className="flex justify-center mt-6 text-sm">
          <span className="text-gray-500">Don't have an account?</span>
          <button
            onClick={() => navigate("/signup")}
            className="ml-2 text-[#008080] font-semibold hover:underline"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================
   Civic Input Component
========================================= */
function Input(props) {
  return (
    <div className="mb-4">
      <input
        {...props}
        className="w-full border border-gray-300 
        focus:border-[#008080] 
        focus:ring-2 focus:ring-[#008080]/30
        outline-none px-4 py-3 rounded-lg transition"
      />
    </div>
  );
}