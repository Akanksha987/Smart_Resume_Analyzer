import { useContext } from "react";
import { ResumeContext } from "../context/ResumeContext";

export default function ATSScore() {
  const { score } = useContext(ResumeContext);

  return <h2>ATS Score: {score}%</h2>;
}
