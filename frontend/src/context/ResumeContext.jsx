import { createContext, useState } from "react";

export const ResumeContext = createContext(null);

export const ResumeProvider = ({ children }) => {
  const [resumeText, setResumeText] = useState("");
  const [role, setRole] = useState("Frontend");
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [score, setScore] = useState(0);

  return (
    <ResumeContext.Provider
      value={{
        resumeText,
        setResumeText,
        role,
        setRole,
        matchedSkills,
        setMatchedSkills,
        missingSkills,
        setMissingSkills,
        score,
        setScore
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};
