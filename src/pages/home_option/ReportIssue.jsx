import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchGPSLocation } from "../../service/location/locationService";
import BackArrow from "../../components/backArrow";
export default function ReportIssue() {
  const navigate = useNavigate();

  // ---------- State ----------
  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [compTitle, setCompTitle] = useState("");
  const [compDescp, setCompDescp] = useState("");

  const [detectedLang, setDetectedLang] = useState("");
  const [aiTrans, setAiTrans] = useState("");

  const [manualLoc, setManualLoc] = useState("");
  const [gpsLoc, setGpsLoc] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [image, setImage] = useState(null);
  const [selectedUrgency, setSelectedUrgency] = useState("");
  const [predictedIssue, setPredictedIssue] = useState("");

  const [aiUrgency, setAiUrgency] = useState("");
  const [loading,setLoading] = useState(false)

  // ---------- Translate ----------
 

  // ---------- Predict Issue ----------
const handlePredict = async () => {

  if (!compDescp.trim()) {
    alert("Enter complaint");
    return;
  }

  setLoading(true);

  try {

    // 1️⃣ Translate complaint
    const translateRes = await fetch("http://localhost:5000/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: compDescp })
    });

    const translateData = await translateRes.json();

    setDetectedLang(translateData.language);
    setAiTrans(translateData.translatedText);

    // 2️⃣ Predict category and urgency
    const predictRes = await fetch("http://localhost:5000/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: translateData.translatedText })
    });

    const predictData = await predictRes.json();

    // Category Mapping
    const mapCategory = (mlCategory) => {
      if (mlCategory === "Water") return "Water";
      if (mlCategory === "Road") return "Road";
      if (mlCategory === "Electricity") return "Electricity";
      if (mlCategory === "Sanitation") return "Waste";
      if (mlCategory === "Drainage") return "Waste";
      return "Others";
    };

    const category = mapCategory(predictData.category);

    setPredictedIssue(category);
    setAiUrgency(predictData.urgency);

  } catch (err) {
    console.error(err);
    alert("Prediction failed");
  } finally {
    setLoading(false);
  }
};
  // ---------- GPS ----------
  const handleGPSFetch = async () => {
    try {
      const res = await fetchGPSLocation();
      setLatitude(res.latitude);
      setLongitude(res.longitude);
      setGpsLoc(res.address);
    } catch {
      alert("GPS fetch failed");
    }
    
  };
  

  // ---------- Category ----------
  const getCategory = (issue) => {
    const lower = issue.toLowerCase();
    if (lower.includes("water")) return "Water";
    if (lower.includes("road")) return "Roads";
    if (lower.includes("electric")) return "Electricity";
    if (lower.includes("waste")) return "Waste";
    return "Others";
  };

  // ---------- Submit ----------
  const handleSubmit = async () => {
    if (
      !customerName ||
      !customerNumber ||
      !compTitle ||
      !compDescp ||
      !manualLoc ||
      !selectedUrgency ||
      !image
    ) {
      alert("⚠️ Please fill all required fields");
      return;
    }

    if (customerNumber.length !== 10 || isNaN(customerNumber)) {
      alert("⚠️ Enter valid 10-digit number");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("⚠️ You are not logged in. Please login again.");
      navigate("/login");
      return;
    }

    const reportData = {
      customerName,
      customerNumber,
      issue: compTitle,
      description: compDescp,
      predictedIssue,
      category: getCategory(compTitle + " " + compDescp),
      urgency: selectedUrgency,
      manualLocation: manualLoc,
      gpsLocation: gpsLoc,
      latitude,
      longitude,
      imageName: image.name,
    };

    try {
      const res = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reportData),
      });

      const data = await res.json();

      alert(
        `✅ Complaint submitted successfully\n\nComplaint ID:\n${data.complaintId}`
      );

      navigate("/home");

    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit complaint");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f8fbff] to-[#e6f4f4] py-10 px-4">
<BackArrow />
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-lg border border-gray-200">

        <h1 className="text-3xl font-bold text-center text-[#101585] mb-8">
          Report Civic Issue
        </h1>

        {/* Name */}
        <label className="font-semibold text-[#101585]">Customer Name *</label>
        <input
          className="w-full border p-3 rounded-lg mb-5"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        {/* Number */}
        <label className="font-semibold text-[#101585]">Customer Number *</label>
        <input
          className="w-full border p-3 rounded-lg mb-5"
          maxLength={10}
          value={customerNumber}
          onChange={(e) => setCustomerNumber(e.target.value)}
        />

        {/* Title */}
        <label className="font-semibold text-[#101585]">Complaint Title *</label>
        <input
          className="w-full border p-3 rounded-lg mb-5"
          value={compTitle}
          onChange={(e) => setCompTitle(e.target.value)}
        />

        {/* Description */}
        <label className="font-semibold text-[#101585]">Complaint Description *</label>
        <textarea
          rows="4"
          className="w-full border p-3 rounded-lg mb-3"
          value={compDescp}
          onChange={(e) => setCompDescp(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex gap-3 mb-4">

        

          <button
  onClick={handlePredict}
  className="bg-[#101585] text-white px-5 py-2 rounded-lg"
>
  {loading ? "Predicting..." : "Predict Issue"}
</button>

        </div>

        <p className="text-sm text-gray-600 mb-2">
          Detected Language: {detectedLang}
        </p>

        <textarea
          readOnly
          className="w-full border p-3 rounded-lg mb-4 bg-gray-50"
          value={aiTrans}
        />

        {/* Predicted Category */}
       
  <p className="text-lg font-semibold text-[#101585] mb-6">
    Predicted Issue: {predictedIssue}
  </p>

       <label className="font-semibold text-[#101585]">AI Predicted Urgency</label>
<input
  type="text"
  readOnly
  value={aiUrgency || ""}
  className="w-full border p-3 rounded-lg"
/>
        {/* Urgency */}
        <label className="font-semibold text-[#101585]">Urgency *</label>
<select
  className="w-full border p-3 rounded-lg mb-6"
  value={selectedUrgency || ""}
  onChange={(e) => setSelectedUrgency(e.target.value)}
>
  <option value="">Select</option>
  <option value="High">High</option>
  <option value="Medium">Medium</option>
  <option value="Normal">Normal</option>
</select>
        {/* Manual Location */}
        <label className="font-semibold text-[#101585]">Manual Location *</label>
        <input
          className="w-full border p-3 rounded-lg mb-5"
          value={manualLoc}
          onChange={(e) => setManualLoc(e.target.value)}
        />

        {/* GPS */}
        <label className="font-semibold text-[#101585]">Automatic GPS</label>
        <input
          readOnly
          className="w-full border p-3 rounded-lg mb-5"
          value={gpsLoc}
        />

        <button
          onClick={handleGPSFetch}
          className="bg-[#101585] text-white px-5 py-2 rounded-lg mb-8"
        >
          Fetch GPS
        </button>

        {/* Image */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full border p-3 rounded-lg mb-8"
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-[#101585] text-white py-4 rounded-xl font-bold"
        >
          Submit Complaint
        </button>

      </div>
    </div>
  );
}