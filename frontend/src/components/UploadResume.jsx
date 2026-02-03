import { useState, useContext } from "react";
import { ResumeContext } from "../context/ResumeContext";
import { roles } from "../data/roles";
import { extractSkills } from "../utils/extractSkills";
import { calculateScore } from "../utils/calculateScore";
import './UploadResume.css'; // Importing CSS for styling

export default function UploadResume() {
  const context = useContext(ResumeContext);
  const [file, setFile] = useState(null);
  const [fileWarning, setFileWarning] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);

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

  const handleFileChange = async (event) => {
    const f = event.target.files && event.target.files[0];
    if (!f) return;

    setFileWarning('');
    setFile(f);

    // Plain text files can be read directly
    if (f.type.startsWith('text/') || /\.txt$/i.test(f.name)) {
      const reader = new FileReader();
      reader.onload = (e) => setResumeText(e.target.result);
      reader.readAsText(f);

    // PDF: extract text using pdfjs-dist
    } else if (f.type === 'application/pdf' || /\.pdf$/i.test(f.name)) {
      setResumeText('');
      setIsExtracting(true);
      setFileWarning('Extracting text from PDF...');
      try {
        const arrayBuffer = await f.arrayBuffer();
        let pdfjsLib;
        try {
          // Prefer the legacy build which is compatible with modern bundlers
          pdfjsLib = await import('pdfjs-dist/legacy/build/pdf');
          const pdfjsWorker = await import('pdfjs-dist/legacy/build/pdf.worker.entry');
          pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
        } catch (e1) {
          try {
            // Fallback to other paths depending on installed version
            pdfjsLib = await import('pdfjs-dist');
            const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
            pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
          } catch (e2) {
            console.error('Failed to load pdfjs modules', e1, e2);
            setIsExtracting(false);
            setFileWarning('PDF parsing is unavailable because pdfjs could not be loaded. Run `npm install` and restart the dev server.');
            return;
          }
        }

        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n';
        }

        if (fullText.trim()) {
          setResumeText(fullText);
          setFileWarning('');
        } else {
          setResumeText('');
          setFileWarning('PDF text could not be extracted. It may be a scanned image PDF.');
        }
      } catch (err) {
        console.error('PDF extraction failed', err);
        setResumeText('');
        setFileWarning('Failed to extract text from PDF. Please try another file or copy/paste the resume.');
      } finally {
        setIsExtracting(false);
      }

    // Image detected: OCR not implemented yet
    } else if (f.type.startsWith('image/') || /\.(jpe?g|png|gif|bmp)$/i.test(f.name)) {
      setResumeText('');
      setFileWarning('Image detected. OCR is not supported yet. Please convert to .txt or copy-paste the resume.');

    // Word docs: parsing not implemented yet
    } else if (f.type === 'application/msword' || /\.(docx?|odt)$/i.test(f.name)) {
      setResumeText('');
      setFileWarning('Word document detected. DOC/DOCX extraction is not supported yet. Please convert to .txt or copy-paste the resume.');
    } else {
      setResumeText('');
      setFileWarning('Unsupported file type. Please upload .txt, .pdf, .docx, or image files.');
    }
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
      <input
        type="file"
        accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
        onChange={handleFileChange}
      />
      <select value={role} onChange={e => setRole(e.target.value)}>
        {Object.keys(roles).map(r => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      <button onClick={analyzeResume} className="upload-button" disabled={!resumeText || isExtracting}>Analyze Resume</button>
      {file && <p>File: {file.name}</p>}
      {fileWarning && <p className="file-warning">{fileWarning}</p>}
      {isExtracting && <p className="file-warning">Extracting PDF text — please wait...</p>}
    </div>
  );
}
