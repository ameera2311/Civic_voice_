import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    newPassword: "",
    confirmPassword: "",
    otp: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const verifyOtp = () => {
    // TODO: OTP verification logic (API)
    alert("OTP Verified (demo)");
  };

  const resetPassword = (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // TODO: Reset password API call
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-start">
      <div className="w-full max-w-md mt-16 px-6">

        {/* Image */}
        <img
          src="/assets/auth/forgot_password.png"
          alt="Forgot Password"
          className="w-64 mx-auto mb-8"
        />

        {/* Title */}
        <h2 className="text-3xl font-bold text-blue-900 text-center mb-8">
          Reset Password
        </h2>

        {/* Form */}
        <form onSubmit={resetPassword} className="space-y-4">

          <Input
            icon="📧"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <Input
            icon="📱"
            name="phone"
            placeholder="Mobile number"
            onChange={handleChange}
          />

          <Input
            icon="🔒"
            name="newPassword"
            type="password"
            placeholder="New Password"
            onChange={handleChange}
          />

          <Input
            icon="🔒"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
          />

          <Input
            icon="🔑"
            name="otp"
            placeholder="Enter OTP"
            onChange={handleChange}
          />

          {/* Verify OTP */}
          <button
            type="button"
            onClick={verifyOtp}
            className="bg-green-600 text-white px-6 py-2 rounded-md"
          >
            Verify
          </button>

          {/* Reset Button */}
          <button
            type="submit"
            className="w-full bg-indigo-900 text-white py-3 rounded-full text-lg font-bold"
          >
            Reset
          </button>
        </form>
      </div>
    </div>
  );
}

/* 🔹 Reusable Input Component */
function Input({ icon, ...props }) {
  return (
    <div className="flex items-center border border-blue-900 rounded-full px-4 py-2">
      <span className="mr-3">{icon}</span>
      <input
        {...props}
        className="w-full outline-none bg-transparent"
      />
    </div>
  );
}
