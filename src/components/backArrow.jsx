import { useNavigate } from "react-router-dom";

export default function BackArrow() {

  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/home")}
      className="fixed top-5 left-5 bg-[#101585] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-900"
    >
      ←
    </button>
  );
}