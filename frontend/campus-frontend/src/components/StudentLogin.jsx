import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentLogin({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ✅ normalize email to lowercase
        body: JSON.stringify({ email: email.toLowerCase(), password }),
      });

      if (res.ok) {
        const studentData = await res.json(); // ✅ get full student object
        alert("Login successful!");
        setUser(studentData); // ✅ save full student object in global state
        localStorage.setItem("user", JSON.stringify(studentData)); // ✅ persist student
        navigate("/student-dashboard");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error during login");
    }
  };

  return (
    <div style={styles.formContainer}>
      <h2>Student Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        /><br/>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        /><br/>
        <button type="submit" style={styles.button}>Login</button>
      </form>
    </div>
  );
}

const styles = {
  formContainer: { marginTop: "50px" },
  input: { padding: "10px", margin: "10px", borderRadius: "5px", width: "250px" },
  button: { backgroundColor: "#2196F3", color: "white", padding: "10px 20px", borderRadius: "5px", border: "none", cursor: "pointer" }
};

export default StudentLogin;
