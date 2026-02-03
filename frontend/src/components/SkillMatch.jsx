import { useContext } from "react";
import { ResumeContext } from "../context/ResumeContext";

export default function SkillMatch() {
  const { matchedSkills, missingSkills } = useContext(ResumeContext);

  return (
    <div>
      <h3>Matched Skills</h3>
      <ul>
        {matchedSkills.map(skill => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>

      <h3>Missing Skills</h3>
      <ul>
        {missingSkills.map(skill => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </div>
  );
}
