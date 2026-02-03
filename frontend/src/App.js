import UploadResume from "./components/UploadResume";
import SkillMatch from "./components/SkillMatch";
import ATSScore from "./components/ATSScore";
import Suggestions from "./components/Suggestions";
import "./index.css";

export default function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Smart Resume Analyzer</h1>
      <UploadResume />
      <ATSScore />
      <SkillMatch />
      <Suggestions />
    </div>
  );
}
