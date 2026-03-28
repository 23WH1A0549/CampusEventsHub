import { useEffect, useState } from "react";
import API from "../api";

function Certificates() {
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const email = localStorage.getItem("email");

      const res = await API.get(`/events/certificates/${email}`);

      setCerts(res.data);
    } catch (err) {
      console.log("Certificate Fetch Error:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📜 Your Certificates</h2>

      {certs.length === 0 ? (
        <p>No certificates available yet</p>
      ) : (
        certs.map((c, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "10px",
              marginTop: "15px",
            }}
          >
            <h3>{c.eventName}</h3>
            <p>📅 {new Date(c.date).toDateString()}</p>

            <a
              href={`http://localhost:5000${c.certificateUrl}`}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "green",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              🎓 Download Certificate
            </a>
          </div>
        ))
      )}
    </div>
  );
}

export default Certificates;