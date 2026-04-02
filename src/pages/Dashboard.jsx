import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config";

function Dashboard() {
  const navigate = useNavigate();

  const [rideId, setRideId] = useState("");
  const [rides, setRides] = useState([]);

  const token = localStorage.getItem("token");

  const handleStartRide = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/ride/start`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setRideId(res.data._id);
      fetchRides();
    } catch {
      alert("Start failed");
    }
  };

  const handleEndRide = async () => {
    if (!rideId) return alert("No active ride");

    try {
      await axios.post(
        `${BASE_URL}/ride/end/${rideId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setRideId("");
      fetchRides();
    } catch {
      alert("End failed");
    }
  };

  const fetchRides = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/ride/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRides(res.data);
    } catch {
      console.log("error fetching rides");
    }
  };

  useEffect(() => {
    if (!token) navigate("/");
    else fetchRides();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>🚗 Smart Ride Dashboard</h2>
        <button style={styles.logout} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div style={styles.actions}>
        <button style={styles.startBtn} onClick={handleStartRide}>
          Start Ride
        </button>

        <button style={styles.endBtn} onClick={handleEndRide}>
          End Ride
        </button>
      </div>

      <h3 style={{ marginTop: "30px" }}>📜 Ride History</h3>

      {rides.length === 0 ? (
        <p style={{ opacity: 0.6 }}>No rides yet</p>
      ) : (
        <div style={styles.grid}>
          {rides.map((ride) => (
            <div key={ride._id} style={styles.card}>
              <p><strong>Status:</strong> {ride.status}</p>
              <p>
                <strong>Start:</strong>{" "}
                {new Date(ride.startTime).toLocaleString()}
              </p>
              <p>
                <strong>End:</strong>{" "}
                {ride.endTime
                  ? new Date(ride.endTime).toLocaleString()
                  : "Not ended"}
              </p>
              <p style={styles.fare}>₹{ride.fare}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    background: "#f5f7fa",
    minHeight: "100vh"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  logout: {
    background: "#ff4d4f",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  actions: {
    marginTop: "20px",
    display: "flex",
    gap: "10px"
  },
  startBtn: {
    background: "#4CAF50",
    color: "#fff",
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  endBtn: {
    background: "#f44336",
    color: "#fff",
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "15px",
    marginTop: "20px"
  },
  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },
  fare: {
    marginTop: "10px",
    fontWeight: "bold",
    fontSize: "18px",
    color: "#1890ff"
  }
};

export default Dashboard;