import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [rideId, setRideId] = useState("");
  const [rides, setRides] = useState([]);

  const token = localStorage.getItem("token");

  // 🚲 start ride
  const handleStartRide = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/ride/start",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setRideId(res.data._id);
      alert("Ride started");

      fetchRides(); // refresh list

    } catch (err) {
      alert("Start failed");
    }
  };

  // 🛑 end ride
  const handleEndRide = async () => {
    if (!rideId) {
      alert("No active ride");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/ride/end/${rideId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Ride ended");
      setRideId("");

      fetchRides(); // refresh list

    } catch (err) {
      alert("End failed");
    }
  };

  // 📜 fetch history
  const fetchRides = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/ride/history",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setRides(res.data);

    } catch (err) {
      console.log("error fetching rides");
    }
  };

  // load on start
  useEffect(() => {
    fetchRides();
  }, []);

  // logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      {/* buttons */}
      <button onClick={handleStartRide}>Start Ride</button>

      <br /><br />

      <button onClick={handleEndRide}>End Ride</button>

      <br /><br />

      <button onClick={handleLogout}>Logout</button>

      <hr />

      {/* history */}
      <h3>Ride History</h3>

      {rides.length === 0 ? (
        <p>No rides yet</p>
      ) : (
        rides.map((ride) => (
          <div
            key={ride._id}
            style={{
              border: "1px solid #ccc",
              margin: "10px 0",
              padding: "10px"
            }}
          >
            <p>Status: {ride.status}</p>
            <p>Start: {new Date(ride.startTime).toLocaleString()}</p>
            <p>
              End:{" "}
              {ride.endTime
                ? new Date(ride.endTime).toLocaleString()
                : "Not ended"}
            </p>
            <p>Fare: ₹{ride.fare}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;