import React from "react";

function Navbar({ user, onLogout }) {
  return (
    <div style={styles.navbar}>
      <h2 style={styles.logo}>CampusDrive</h2>
      {user && (
        <div style={styles.userSection}>
          <span style={styles.userEmail}>{user.email}</span>
          <button onClick={onLogout} style={styles.logout}>Logout</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "linear-gradient(to right, #6a11cb, #2575fc)",
    padding: "15px 30px",
    color: "white",
    position: "fixed",
    top: 0,
    width: "100%",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
  },
  logo: { fontSize: "24px", fontWeight: "bold" },
  userSection: { display: "flex", alignItems: "center", gap: "15px" },
  userEmail: { fontWeight: "bold" },
  logout: {
    backgroundColor: "#ff9800",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    color: "white",
    fontWeight: "bold"
  }
};

export default Navbar;
