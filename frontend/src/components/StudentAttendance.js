import { useEffect, useState } from "react";
import API from "../api";

function StudentAttendance() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const email = localStorage.getItem("email");

      const res = await API.get(`/events/attendance/${email}`);
      setData(res.data);

    } catch (err) {
      console.log("Error:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📋 My Attendance</h2>

      {data.length === 0 ? (
        <p>No records found</p>
      ) : (
        <div>
          {data.map((item, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px 0",
                borderRadius: "8px",
              }}
            >
              <h3>{item.eventName}</h3>
              <p>📅 {new Date(item.date).toDateString()}</p>
              <p>📍 {item.venue}</p>

              <p>
                Status:{" "}
                <strong
                  style={{
                    color:
                      item.status === "attended" ? "green" : "red",
                  }}
                >
                  {item.status === "attended"
                    ? "✅ Attended"
                    : "❌ Not Attended"}
                </strong>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentAttendance;