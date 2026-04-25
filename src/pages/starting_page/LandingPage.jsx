import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


const LandingPage = () => {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-white text-gray-800 font-sans">

{/* ================= NAVBAR ================= */}
<nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
  <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

    {/* LOGO */}
    <div
      className="flex items-center gap-3 cursor-pointer"
      onClick={() => scrollToSection("home")}
    >
      <img
        src="/assets/logo.png"
        className="w-12 h-12 object-contain"
      />

      <h1 className="text-xl font-bold text-[#101585] tracking-wide">
        Civic Voice
      </h1>
    </div>

    {/* NAV LINKS */}
    <div className="hidden md:flex gap-8 items-center font-medium">

      <button
        onClick={() => scrollToSection("home")}
        className="hover:text-[#008080] transition"
      >
        Home
      </button>

      <button
        onClick={() => scrollToSection("about")}
        className="hover:text-[#008080] transition"
      >
        About
      </button>

      <button
        onClick={() => scrollToSection("contact")}
        className="hover:text-[#008080] transition"
      >
        Contact
      </button>

      <button
        onClick={() => navigate("/admin-login")}
        className="px-5 py-2 rounded-lg bg-[#101585] text-white hover:bg-[#0d116b] transition"
      >
        Admin
      </button>

    </div>
  </div>
</nav>


{/* ================= HERO ================= */}
<section
  id="home"
  className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-28
  bg-linear-to-br from-blue-50 via-white to-cyan-50"
>

<motion.h1
  initial={{ opacity: 0, y: -30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  className="text-4xl md:text-6xl font-bold text-[#101585]"
>

  Empowering Citizens  
  <span className="block text-[#008080]">
    Strengthening Governance
  </span>

</motion.h1>


<motion.p
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.4, duration: 0.8 }}
  className="mt-6 text-gray-600 max-w-2xl"
>

  Civic Voice enables citizens to report civic issues such as
  road damage, water leakage, electricity faults and waste
  management problems while authorities track and resolve them
  efficiently.

</motion.p>


<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.8, duration: 0.8 }}
  className="mt-10 flex gap-4 flex-wrap justify-center"
>

<button
  onClick={() => navigate("/signup")}
  className="px-8 py-3 bg-[#FFDD44] text-black font-semibold rounded-xl shadow-md hover:scale-105 transition"
>
  Register Complaint
</button>

<button
  onClick={() => navigate("/login")}
  className="px-8 py-3 bg-[#008080] text-white font-semibold rounded-xl hover:scale-105 transition"
>
  Citizen Login
</button>

</motion.div>

</section>


{/* ================= FEATURES ================= */}
<section id="about" className="py-24 px-6 bg-white">

<div className="max-w-6xl mx-auto text-center mb-12">

<h2 className="text-3xl font-bold text-[#101585]">
How Civic Voice Works
</h2>

<p className="text-gray-600 mt-3">
A transparent system for citizens and administration.
</p>

</div>


<div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

{[
{
title: "Report Issues",
icon: "📢",
desc: "Citizens submit complaints with location, category and urgency."
},

{
title: "Track Status",
icon: "📊",
desc: "Track complaint progress from submission to resolution."
},

{
title: "Administrative Dashboard",
icon: "🏛️",
desc: "Officials assign workers and analyze complaint data."
}

].map((item, index) => (

<motion.div
key={index}
whileHover={{ scale: 1.05 }}
className="bg-linear-to-br from-blue-50 to-white border border-gray-200
rounded-2xl p-8 shadow-md"
>

<div className="text-4xl mb-4">
{item.icon}
</div>

<h3 className="text-xl font-semibold text-[#101585] mb-3">
{item.title}
</h3>

<p className="text-gray-600">
{item.desc}
</p>

</motion.div>

))}

</div>
</section>


{/* ================= STATISTICS ================= */}
<section className="py-20 bg-[#008080]/5">

<div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-center">

{[
{ number: "10K+", label: "Complaints Submitted" },
{ number: "8K+", label: "Resolved Issues" },
{ number: "500+", label: "Active Workers" },
{ number: "100+", label: "Cities Connected" }
].map((stat, index) => (

<div key={index} className="bg-white p-6 rounded-2xl shadow">

<h3 className="text-3xl font-bold text-[#101585]">
{stat.number}
</h3>

<p className="text-gray-600 mt-2">
{stat.label}
</p>

</div>

))}

</div>
</section>


{/* ================= CONTACT ================= */}
<section
id="contact"
className="py-24 px-6 bg-linear-to-br from-white to-blue-50 text-center"
>

<h2 className="text-3xl font-bold text-[#101585] mb-6">
Contact Administration
</h2>

<p className="text-gray-700 max-w-2xl mx-auto mb-8">
For urgent civic issues or administrative assistance,
please contact the official coordination office.
</p>

<div className="bg-white rounded-2xl p-10 max-w-md mx-auto shadow-lg border">

<h3 className="text-lg font-semibold text-[#101585] mb-4">
Administrative Office
</h3>

<p className="text-gray-700">📞 +91 98765 43210</p>

<p className="text-gray-700 mt-2">📧 admin@civicvoice.gov</p>

<p className="text-gray-700 mt-2">📍 Municipal Office</p>

</div>

</section>


{/* ================= FOOTER ================= */}
<footer className="bg-[#101585] text-white py-6 text-center">

© {new Date().getFullYear()} Civic Voice · Smart Governance Platform

</footer>

</div>
  );
};

export default LandingPage;