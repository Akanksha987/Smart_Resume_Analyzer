import { useState, useContext } from "react";
import { ResumeContext } from "../context/ResumeContext";
import { roles } from "../data/roles";
import { extractSkills } from "../utils/extractSkills";
import { calculateScore } from "../utils/calculateScore";
import './UploadResume.css'; // Importing CSS for styling

export default function UploadResume() {
  const context = useContext(ResumeContext);
  const [file, setFile] = useState(null);

  if (!context) {
    return <p>Loading Resume Analyzer...</p>;
  }

  const {
    resumeText,
    setResumeText,
    role,
    setRole,
    setMatchedSkills,
    setMissingSkills,
    setScore
  } = context;

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = (e) => setResumeText(e.target.result);
    reader.readAsText(event.target.files[0]);
  };

  const analyzeResume = () => {
    const requiredSkills = roles[role];
    const { matched, missing } = extractSkills(resumeText, requiredSkills);

    setMatchedSkills(matched);
    setMissingSkills(missing);
    setScore(calculateScore(matched.length, requiredSkills.length));
  };

  return (
    <div className="upload-container">
      <h2>Upload Your Resume</h2>
      <input type="file" accept="text/plain" onChange={handleFileChange} />
      <select value={role} onChange={e => setRole(e.target.value)}>
        {Object.keys(roles).map(r => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      <button onClick={analyzeResume} className="upload-button">Analyze Resume</button>
      {file && <p>File: {file.name}</p>}
    </div>
  );
}
