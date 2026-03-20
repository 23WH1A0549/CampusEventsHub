import { Outlet, useNavigate } from "react-router-dom";
import "./dashboard.css";

function DashboardLayout() {

  const navigate = useNavigate();
  const username = localStorage.getItem("name") || "Student";

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (

    <div className="dashboard-container">

      {/* Sidebar */}
      <div className="sidebar">

        <h2 className="logo">🎓 Campus Hub</h2>

        <p onClick={() => navigate("/student-dashboard")}>
          🏠 Dashboard
        </p>

        <p onClick={() => navigate("/student-dashboard/upcoming")}>
          📅 Upcoming Events
        </p>

        <p onClick={() => navigate("/student-dashboard/ongoing")}>
          🔥 Ongoing Events
        </p>

        <p onClick={() => navigate("/student-dashboard/completed")}>
          ✅ Completed Events
        </p>

        <p onClick={() => navigate("/student-dashboard/myevents")}>
          🎟 My Events
        </p>

        <p onClick={() => navigate("/student-dashboard/attendance")}>
          🎟 Attendance
        </p>

        <p onClick={() => navigate("/student-dashboard/certificate")}>
          📜 Certificates
        </p>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>

      </div>

      {/* Main Section */}
      <div className="dashboard-main">

        {/* Top Header */}
        <div className="top-header">

          <h2 className="dashboard-title">
            CAMPUS EVENTS HUB
          </h2>

          <div className="user-info">
            👤 {username}
          </div>

        </div>

        {/* Page Content */}
        <div className="page-content">
          <Outlet />
        </div>

      </div>

    </div>
  );
}

export default DashboardLayout;