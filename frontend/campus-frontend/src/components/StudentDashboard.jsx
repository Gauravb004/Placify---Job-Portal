import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [student, setStudent] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    cgpa: "",
    skills: "",
    resumePath: ""
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [eligibleDrives, setEligibleDrives] = useState([]);
  const [editMode, setEditMode] = useState(false);

  // ✅ 1. Load data on Mount (Warning fixed)
  useEffect(() => {
    const loggedInUser = localStorage.getItem("studentUser");
    if (loggedInUser) {
      const data = JSON.parse(loggedInUser);
      setStudent(data);
      console.log("Student session loaded:", data.name);
    } else {
      console.log("No student session found. Please save profile.");
    }
  }, []);

  // ✅ 2. Save/Update Profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/student/addOrUpdate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });
      if (res.ok) {
        const updated = await res.json();
        setStudent(updated);
        localStorage.setItem("studentUser", JSON.stringify(updated)); // Session update
        setEditMode(false);
        toast.success("Profile saved successfully! 🚀");
      } else {
        toast.error("Error saving profile");
      }
    } catch (err) {
      toast.error("Server connection failed");
    }
  };

  // ✅ 3. Upload Resume
  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!student.id) {
      toast.warning("Bhai, pehle profile save karle!");
      return;
    }
    if (!resumeFile) {
      toast.info("Pehle file select toh kar!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    try {
      const res = await fetch(`http://localhost:8080/student/uploadResume/${student.id}`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const updated = await res.json();
        setStudent(updated);
        localStorage.setItem("studentUser", JSON.stringify(updated));
        toast.success("Resume uploaded! 📄");
      }
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  // ✅ 4. Check Eligibility
  const fetchEligibleDrives = async () => {
    if (!student.id) {
      toast.info("Please save profile first");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/student/eligible/${student.id}`);
      if (res.ok) {
        const data = await res.json();
        setEligibleDrives(data);
        data.length > 0
          ? toast.success(`Found ${data.length} drives!`)
          : toast.info("No matching drives found.");
      }
    } catch (err) {
      toast.error("Error fetching drives");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎓 Student Dashboard</h1>

      {/* Navigation Tabs */}
      <div style={styles.tabs}>
        <button style={activeTab === "profile" ? styles.activeTab : styles.tab} onClick={() => setActiveTab("profile")}>Profile</button>
        <button style={activeTab === "resume" ? styles.activeTab : styles.tab} onClick={() => setActiveTab("resume")}>Resume</button>
        <button style={activeTab === "eligibility" ? styles.activeTab : styles.tab} onClick={() => setActiveTab("eligibility")}>Eligibility</button>
      </div>

      <div style={styles.contentArea}>
        {/* --- Profile Section --- */}
        {activeTab === "profile" && (
          <div style={styles.card}>
            <h2 style={styles.subtitle}>My Profile</h2>
            {!editMode && student.id ? (
              <div style={styles.viewMode}>
                <div style={styles.infoBox}>
                  <p><strong>Name:</strong> {student.name}</p>
                  <p><strong>Email:</strong> {student.email}</p>
                  <p><strong>Branch:</strong> {student.branch || "Not Set"}</p>
                  <p><strong>CGPA:</strong> {student.cgpa || "0.0"}</p>
                  <p><strong>Skills:</strong> {student.skills || "None"}</p>
                </div>
                <button style={styles.editBtn} onClick={() => setEditMode(true)}>Update Profile Details</button>
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit} style={styles.form}>
                <input type="text" placeholder="Name" value={student.name || ""} onChange={(e) => setStudent({...student, name: e.target.value})} style={styles.input} required />
                <input type="email" placeholder="Email" value={student.email || ""} onChange={(e) => setStudent({...student, email: e.target.value})} style={styles.input} required />
                <input type="password" placeholder="Password (Optional)" value={student.password || ""} onChange={(e) => setStudent({...student, password: e.target.value})} style={styles.input} />
                <div style={styles.row}>
                  <input type="text" placeholder="Branch" value={student.branch || ""} onChange={(e) => setStudent({...student, branch: e.target.value})} style={{...styles.input, flex: 1, marginRight: '10px'}} />
                  <input type="number" step="0.1" placeholder="CGPA" value={student.cgpa || ""} onChange={(e) => setStudent({...student, cgpa: e.target.value})} style={{...styles.input, flex: 1}} />
                </div>
                <input type="text" placeholder="Skills (Java, SQL, React)" value={student.skills || ""} onChange={(e) => setStudent({...student, skills: e.target.value})} style={styles.input} />
                <div style={{display: 'flex', gap: '10px'}}>
                  <button type="submit" style={styles.saveBtn}>{student.id ? "Update Changes" : "Save Profile"}</button>
                  {student.id && <button type="button" onClick={() => setEditMode(false)} style={styles.cancelBtn}>Cancel</button>}
                </div>
              </form>
            )}
          </div>
        )}

        {/* --- Resume Section --- */}
        {activeTab === "resume" && (
          <div style={styles.card}>
            <h2 style={styles.subtitle}>Resume Management</h2>
            {student.resumePath && (
              <div style={styles.statusOk}>
                ✅ Resume exists: <a href={`http://localhost:8080/files/${student.resumePath}`} target="_blank" rel="noreferrer" style={styles.link}>View Resume PDF</a>
              </div>
            )}
            <form onSubmit={handleResumeUpload} style={{marginTop: '20px'}}>
              <input type="file" onChange={(e) => setResumeFile(e.target.files[0])} style={styles.input} accept="application/pdf" />
              <button type="submit" style={styles.saveBtn}>{student.resumePath ? "Replace Current Resume" : "Upload Resume"}</button>
            </form>
          </div>
        )}

        {/* --- Eligibility Section --- */}
        {activeTab === "eligibility" && (
          <div style={styles.card}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', alignItems:'center'}}>
              <h2 style={styles.subtitle}>Eligible Drives</h2>
              <button onClick={fetchEligibleDrives} style={styles.refreshBtn}>Refresh Eligibility</button>
            </div>
            <div style={{overflowX: 'auto'}}>
              <table style={styles.table}>
                <thead>
                  <tr style={{background: '#f8f9fa'}}>
                    <th style={styles.th}>Company</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Min CGPA</th>
                    <th style={styles.th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {eligibleDrives.length > 0 ? (
                    eligibleDrives.map(d => (
                      <tr key={d.id} style={styles.tr}>
                        <td style={styles.td}>{d.companyName}</td>
                        <td style={styles.td}>{d.role}</td>
                        <td style={styles.td}>{d.minCgpa}</td>
                        <td style={styles.td}>{new Date(d.date).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" style={{textAlign:'center', padding:'30px', color: '#999'}}>No eligible drives found. Update your CGPA/Skills!</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)", padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
  title: { color: "white", marginBottom: "30px", textShadow: "1px 1px 5px rgba(0,0,0,0.2)" },
  tabs: { display: "flex", gap: "10px", marginBottom: "25px" },
  tab: { padding: "10px 25px", borderRadius: "25px", border: "none", cursor: "pointer", background: "rgba(255,255,255,0.2)", color: "white", fontWeight: "600" },
  activeTab: { padding: "10px 25px", borderRadius: "25px", border: "none", cursor: "pointer", background: "white", color: "#0072ff", fontWeight: "bold", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" },
  contentArea: { width: "100%", maxWidth: "850px" },
  card: { background: "white", padding: "30px", borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", color: "#333" },
  subtitle: { marginTop: 0, color: "#444", borderBottom: "2px solid #f0f0f0", paddingBottom: "10px", fontWeight: "600" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: { padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "15px" },
  row: { display: "flex" },
  infoBox: { background: "#f9f9f9", padding: "20px", borderRadius: "10px", marginBottom: "20px", border: "1px solid #eee" },
  saveBtn: { padding: "12px", background: "#2ecc71", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", flex: 1 },
  cancelBtn: { padding: "12px", background: "#e74c3c", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" },
  editBtn: { padding: "12px 25px", background: "#0072ff", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
  refreshBtn: { background: "#8e44ad", color: "white", border: "none", padding: "10px 18px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  viewMode: { lineHeight: "1.6" },
  statusOk: { background: "#d4edda", padding: "15px", borderRadius: "8px", color: "#155724", border: "1px solid #c3e6cb" },
  link: { fontWeight: "bold", color: "#0072ff", textDecoration: "underline" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "15px", textAlign: "left", borderBottom: "2px solid #eee", color: "#666" },
  td: { padding: "15px", borderBottom: "1px solid #eee" },
  tr: { hover: { background: "#f1f1f1" } }
};

export default StudentDashboard;