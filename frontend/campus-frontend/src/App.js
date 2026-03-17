import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import StudentLogin from "./components/StudentLogin";
import SignupStudent from "./components/SignupStudent";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import StudentDashboard from "./components/StudentDashboard";
import Navbar from "./components/Navbar";

function App() {
  // ✅ Load user from localStorage on refresh
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // ✅ persist user whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user"); // clear storage
    window.location.href = "/login"; // redirect to login page
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} /> {/* ✅ Navbar added */}
      <div style={styles.container}>
        <h1 style={styles.title}>CampusDrive Portal</h1>
        {!user && ( // ✅ show buttons only if not logged in
          <div style={styles.buttonContainer}>
            <Link to="/signup" style={styles.button}>Student Signup</Link>
            <Link to="/login" style={styles.button}>Student Login</Link>
            <Link to="/admin-login" style={styles.button}>Admin Login</Link>
          </div>
        )}

        <Routes>
          {/* Student Routes */}
          <Route path="/signup" element={<SignupStudent setUser={setUser} />} />
          <Route path="/login" element={<StudentLogin setUser={setUser} />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin setUser={setUser} />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px",
    fontFamily: "Arial, sans-serif",
    background: "linear-gradient(to right, #6a11cb, #2575fc)",
    minHeight: "100vh",
    color: "white",
    padding: "20px"
  },
  title: {
    fontSize: "40px",
    marginBottom: "40px"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px"
  },
  button: {
    backgroundColor: "#ff9800",
    color: "white",
    padding: "15px 30px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "18px",
    fontWeight: "bold",
    transition: "0.3s"
  }
};

export default App;
