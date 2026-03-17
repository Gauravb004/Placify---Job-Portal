import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupStudent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/student/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      alert("Signup successful! Please login.");
      navigate("/login"); // ✅ correct redirect
    } else {
      alert("Signup failed");
    }
  };

  return (
    <div style={styles.formContainer}>
      <h2>Student Signup</h2>
      <form onSubmit={handleSignup}>
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
        <button type="submit" style={styles.button}>Signup</button>
      </form>
    </div>
  );
}

const styles = {
  formContainer: { marginTop: "50px" },
  input: { padding: "10px", margin: "10px", borderRadius: "5px", width: "250px" },
  button: { backgroundColor: "#4CAF50", color: "white", padding: "10px 20px", borderRadius: "5px", border: "none" }
};

export default SignupStudent;
