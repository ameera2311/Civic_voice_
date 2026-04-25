import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    const { username, email, phone, password, confirmPassword } = form;

    if (!username || !email || !phone || !password || !confirmPassword) {
      alert("⚠️ Please fill all fields");
      return;
    }

    if (phone.length !== 10 || isNaN(phone)) {
      alert("⚠️ Enter a valid 10-digit mobile number");
      return;
    }

    if (password !== confirmPassword) {
      alert("❗ Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: username,
          email,
          phone_number: phone,
          password,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Signup failed");
      }

      localStorage.clear();

      alert("✅ Signup successful. Please login.");
      navigate("/login");
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
          Create Your Account
        </h2>

        <Input
          name="username"
          placeholder="Full Name"
          onChange={handleChange}
        />

        <Input
          name="email"
          placeholder="Email Address"
          type="email"
          onChange={handleChange}
        />

        <Input
          name="phone"
          placeholder="Mobile Number"
          maxLength={10}
          onChange={handleChange}
        />

        <Input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full mt-6 bg-[#FFDD44] hover:scale-105 
          transition text-black py-3 rounded-xl text-lg font-semibold shadow-md"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <div className="flex justify-center mt-6 text-sm">
          <span className="text-gray-500">Already have an account?</span>
          <button
            onClick={() => navigate("/login")}
            className="ml-2 text-[#008080] font-semibold hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Modern Civic Input */
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