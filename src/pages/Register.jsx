import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import BASE_URL from "../config"; // 👈 add this

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        name,
        email,
        password
      });

      alert("Account created");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Register</h2>

        <form onSubmit={handleRegister}>
          <input
            style={styles.input}
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button style={styles.button}>Register</button>
        </form>

        <p style={styles.text}>
          Already have account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eef1f5"
  },

  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "320px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
  },

  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333"
  },

  input: {
    width: "100%",
    padding: "11px",
    marginBottom: "12px",
    border: "1px solid #ddd",
    borderRadius: "6px"
  },

  button: {
    width: "100%",
    padding: "11px",
    background: "#4a90e2",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  text: {
    marginTop: "12px",
    textAlign: "center",
    fontSize: "14px"
  }
};

export default Register;