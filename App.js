import React, { useState } from 'react';
import './App.css';
import jsPDF from 'jspdf';

const questions = [
  {
    section: 'Physical Traits Observation',
    questions: [
      { q: 'Skin type', options: ['Dry', 'Oily', 'Balanced'] },
      { q: 'Body build', options: ['Thin', 'Muscular', 'Heavy'] },
      { q: 'Hair type', options: ['Dry', 'Oily', 'Thick', 'Thin'] },
      { q: 'Eyes', options: ['Small', 'Medium', 'Large'] },
    ]
  },
  {
    section: 'Mental and Emotional Traits',
    questions: [
      { q: 'Mindset', options: ['Calm', 'Intense', 'Restless'] },
      { q: 'Memory', options: ['Good memory', 'Forgetful'] },
      { q: 'Emotions', options: ['Anger', 'Anxiety', 'Content'] },
    ]
  },
  {
    section: 'Daily Habits and Preferences',
    questions: [
      { q: 'Diet preference', options: ['Hot', 'Cold', 'Spicy', 'Sweet'] },
      { q: 'Sleep pattern', options: ['Deep', 'Light', 'Trouble sleeping'] },
      { q: 'Energy levels', options: ['Energetic', 'Balanced', 'Fatigue'] },
    ]
  },
  {
    section: 'Environmental Reactions',
    questions: [
      { q: 'Weather preference', options: ['Warm', 'Cool', 'Moderate'] },
      { q: 'Stress response', options: ['Anxious', 'Irritable', 'Calm'] },
    ]
  },
];

function App() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleChange = (section, question, answer) => {
    setAnswers({ ...answers, [question]: answer });
  };

  const analyzeResult = () => {
    const prakritiCount = { Vata: 0, Pitta: 0, Kapha: 0 };

    Object.values(answers).forEach((ans) => {
      const a = ans.toLowerCase();
      if (["dry", "thin", "restless", "anxious", "light", "cold"].includes(a)) prakritiCount.Vata++;
      else if (["muscular", "intense", "anger", "spicy", "hot", "irritable"].includes(a)) prakritiCount.Pitta++;
      else if (["heavy", "calm", "content", "sweet", "deep", "balanced"].includes(a)) prakritiCount.Kapha++;
    });

    const highest = Object.entries(prakritiCount).sort((a, b) => b[1] - a[1])[0][0];
    setResult({ type: highest, breakdown: prakritiCount });
  };

  const generatePDF = () => {
    if (!result) return;

    const pdf = new jsPDF('p', 'mm', 'a4');
    let y = 20;

    pdf.setFontSize(18);
    pdf.text("Prakriti Analysis Report", 20, y);
    y += 10;

    pdf.setFontSize(14);
    pdf.text(`Dominant Prakriti: ${result.type}`, 20, y);
    y += 10;

    pdf.setFontSize(12);
    pdf.text("Breakdown:", 20, y);
    y += 8;
    pdf.text(`- Vata: ${result.breakdown.Vata}`, 25, y);
    y += 6;
    pdf.text(`- Pitta: ${result.breakdown.Pitta}`, 25, y);
    y += 6;
    pdf.text(`- Kapha: ${result.breakdown.Kapha}`, 25, y);
    y += 10;

    pdf.setFontSize(14);
    pdf.text("Your Selections:", 20, y);
    y += 8;

    Object.entries(answers).forEach(([q, a]) => {
      const lines = pdf.splitTextToSize(`${q}: ${a}`, 170);
      lines.forEach((line) => {
        if (y > 280) {
          pdf.addPage();
          y = 20;
        }
        pdf.text(line, 25, y);
        y += 6;
      });
    });

    pdf.save('prakriti_report.pdf');
  };

  return (
    <div className="container">
      <h1 className="main-title">Prakriti Identifier</h1>
      <div className="progress">Answered: {Object.keys(answers).length} / 13</div>

      {questions.map((sec, i) => (
        <div key={i} className="section">
          <h2>{sec.section}</h2>
          {sec.questions.map((q, idx) => (
            <div className="question" key={idx}>
              <p>{q.q}</p>
              {q.options.map((opt, id) => (
                <label key={id} className="option-label">
                  <input
                    type="radio"
                    name={q.q}
                    value={opt}
                    checked={answers[q.q] === opt}
                    onChange={() => handleChange(sec.section, q.q, opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
        </div>
      ))}

      <button className="submit-btn" onClick={analyzeResult}>Submit</button>

      {result && (
        <div className="result">
          <h2>Your Dominant Prakriti: <span className="prakriti-type">{result.type}</span></h2>
          <div className="breakdown">
            <h3>Breakdown:</h3>
            <p><strong>Vata:</strong> {result.breakdown.Vata}</p>
            <p><strong>Pitta:</strong> {result.breakdown.Pitta}</p>
            <p><strong>Kapha:</strong> {result.breakdown.Kapha}</p>
          </div>
          <div className="selections">
            <h3>Your Selections:</h3>
            <ul>
              {Object.entries(answers).map(([q, a], i) => (
                <li key={i}><strong>{q}:</strong> {a}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {result && (
        <button className="submit-btn" onClick={generatePDF}>Download PDF Report</button>
      )}
    </div>
  );
}

export default App;