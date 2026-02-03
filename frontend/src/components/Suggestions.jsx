import { useContext } from "react";
import { ResumeContext } from "../context/ResumeContext";

export default function Suggestions() {
  const { missingSkills } = useContext(ResumeContext);

  if (missingSkills.length === 0) return null;

  return (
    <div>
      <h3>Suggestions</h3>
      <p>Add these skills to improve ATS score:</p>
      <ul>
        {missingSkills.map(skill => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </div>
  );
}
