import { useState } from "react";

function ResumeForm() {
  const [student, setStudent] = useState({
    name: "",
    email: "",
    branch: "",
    cgpa: "",
    resume: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:8080/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    });
    alert("Resume submitted!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" onChange={e => setStudent({ ...student, name: e.target.value })} />
      <input placeholder="Email" onChange={e => setStudent({ ...student, email: e.target.value })} />
      <input placeholder="Branch" onChange={e => setStudent({ ...student, branch: e.target.value })} />
      <input placeholder="CGPA" type="number" onChange={e => setStudent({ ...student, cgpa: e.target.value })} />
      <textarea placeholder="Paste Resume" onChange={e => setStudent({ ...student, resume: e.target.value })}></textarea>
      <button type="submit">Submit</button>
    </form>
  );
}

export default ResumeForm;
