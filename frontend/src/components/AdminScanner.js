import { Scanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api";

function AdminScanner() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // 📍 Get eventId from URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const eventIdFromURL = queryParams.get("eventId");

  const handleScan = async (result) => {
  if (!result || result.length === 0) return;

  try {
    console.log("📸 QR Raw Result:", result);

    // ✅ FIX: handle both rawValue & text
    const qrText = result[0].rawValue || result[0].text;

    console.log("📄 QR Text:", qrText);

    const data = JSON.parse(qrText);

    console.log("📤 Sending to backend:", {
      email: data.email,
      eventId: eventIdFromURL || data.eventId,
    });

    const res = await API.post("/events/mark-attendance", {
      email: data.email,
      eventId: eventIdFromURL || data.eventId,
    });

    setMessage(res.data.message);

    // 🔊 sound
    new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg").play();

  } catch (err) {
    console.log("❌ Scan Error:", err);
    setMessage("Invalid QR ❌");
  }
};

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      
      <h2>📷 Scan QR for Attendance</h2>

      {eventIdFromURL && (
        <p style={{ color: "#007bff", fontWeight: "bold" }}>
          Event ID: {eventIdFromURL}
        </p>
      )}

      {/* Scanner */}
      <div style={{ width: "320px", margin: "20px auto" }}>
        <Scanner
          onScan={handleScan}
          onError={(err) => console.log(err)}
        />
      </div>

      {/* Message */}
      <p style={{ fontSize: "18px", fontWeight: "bold" }}>
        {message}
      </p>

      {/* Back Button */}
      <button
        onClick={() => navigate("/admin-dashboard")}
        style={{
          marginTop: "15px",
          padding: "8px 15px",
          borderRadius: "6px",
          border: "none",
          background: "#333",
          color: "#fff",
          cursor: "pointer"
        }}
      >
        ⬅ Back to Dashboard
      </button>

    </div>
  );
}

export default AdminScanner;