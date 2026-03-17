import React, { useState, useEffect } from "react";

function AdminDashboard() {
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [minCgpa, setMinCgpa] = useState("");
  const [branch, setBranch] = useState("");
  const [skills, setSkills] = useState("");
  const [date, setDate] = useState("");
  const [drives, setDrives] = useState([]);
  const [editId, setEditId] = useState(null); // ✅ track which drive is being edited

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        companyName: companyName.trim() !== "" ? companyName : null,
        role: role.trim() !== "" ? role : null,
        minCgpa: minCgpa && minCgpa.trim() !== "" ? parseFloat(minCgpa) : null,
        branch: branch.trim() !== "" ? branch : null,
        skills: skills.trim() !== "" ? skills : null,
        date: date.trim() !== "" ? date : null,
      };

      let res;
      if (editId) {
        // ✅ Update existing drive
        res = await fetch(`http://localhost:8080/drive/update/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // ✅ Add new drive
        res = await fetch("http://localhost:8080/drive/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        alert(editId ? "Drive updated successfully!" : "Drive added successfully!");
        resetForm();
        fetchDrives();
      } else {
        alert("Error saving drive");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error while saving drive");
    }
  };

  const fetchDrives = async () => {
    try {
      const res = await fetch("http://localhost:8080/drive/all");
      if (res.ok) {
        const data = await res.json();
        setDrives(data);
      }
    } catch (err) {
      console.error("Error fetching drives:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/drive/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Drive deleted successfully!");
        fetchDrives();
      } else {
        alert("Error deleting drive");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleEdit = (drive) => {
    setEditId(drive.id);
    setCompanyName(drive.companyName || "");
    setRole(drive.role || "");
    setMinCgpa(drive.minCgpa || "");
    setBranch(drive.branch || "");
    setSkills(drive.skills || "");
    setDate(drive.date || "");
  };

  const resetForm = () => {
    setEditId(null);
    setCompanyName("");
    setRole("");
    setMinCgpa("");
    setBranch("");
    setSkills("");
    setDate("");
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>

      <div style={styles.card}>
        <h2 style={styles.subtitle}>{editId ? "Edit Drive" : "Add New Drive"}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
            <input type="text" placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} style={styles.input} />
            <input type="text" placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} style={styles.input} />
          </div>
          <div style={styles.formRow}>
            <input type="number" step="0.1" placeholder="Minimum CGPA" value={minCgpa} onChange={(e) => setMinCgpa(e.target.value)} style={styles.input} />
            <input type="text" placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} style={styles.input} />
          </div>
          <div style={styles.formRow}>
            <input type="text" placeholder="Skills" value={skills} onChange={(e) => setSkills(e.target.value)} style={styles.input} />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={styles.input} />
          </div>
          <div style={styles.formRow}>
            <button type="submit" style={styles.button}>{editId ? "Update Drive" : "Add Drive"}</button>
            {editId && <button type="button" onClick={resetForm} style={styles.cancelButton}>Cancel</button>}
          </div>
        </form>
      </div>

      <h2 style={styles.subtitle}>All Drives</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Min CGPA</th>
            <th>Branch</th>
            <th>Skills</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {drives.length > 0 ? (
            drives.map((d) => (
              <tr key={d.id}>
                <td>{d.companyName}</td>
                <td>{d.role}</td>
                <td>{d.minCgpa}</td>
                <td>{d.branch}</td>
                <td>{d.skills}</td>
                <td>{d.date}</td>
                <td>
                  <button onClick={() => handleEdit(d)} style={styles.editButton}>Edit</button>
                  <button onClick={() => handleDelete(d.id)} style={styles.deleteButton}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No drives available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { padding: "20px", fontFamily: "Arial, sans-serif" },
  title: { textAlign: "center", marginBottom: "20px", color: "#333" },
  card: { background: "#f9f9f9", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", marginBottom: "30px" },
  subtitle: { marginBottom: "15px", color: "#444" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  formRow: { display: "flex", gap: "15px" },
  input: { flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" },
  button: { backgroundColor: "#4CAF50", color: "white", padding: "12px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold" },
  cancelButton: { backgroundColor: "#999", color: "white", padding: "12px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
  th: { border: "1px solid #ddd", padding: "10px", backgroundColor: "#eee" },
  td: { border: "1px solid #ddd", padding: "10px", textAlign: "center" },
  editButton: { backgroundColor: "#2196F3", color: "white", padding: "6px 10px", border: "none", borderRadius: "4px", marginRight: "5px", cursor: "pointer" },
  deleteButton: { backgroundColor: "#f44336", color: "white", padding: "6px 10px", border: "none", borderRadius: "4px", cursor: "pointer" }
};

export default AdminDashboard;
