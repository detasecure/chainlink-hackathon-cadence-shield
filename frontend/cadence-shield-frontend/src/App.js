import React, { useState } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-monokai';
import './App.css';


function Header() {
  return (
    <header className="header">
      <img src="https://getsecured.ai/images/getsecured-logo.png" alt="CadenceShield logo" height="60" />
      <h4 style={{ fontSize: '2.5rem' }}>CadenceShield: Flow Contract Inspector</h4>
    </header>
  );
}


function App() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState({});
  const [isCodeEmpty, setIsCodeEmpty] = useState(true);

  const analyzeCode = async () => {
    const response = await fetch('http://localhost:8080/analyze_flow_cadence_code/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    });

    const data = await response.json();

    setOutput(data.results);
  };

  const getRiskScoreColor = (score) => {
    if (score <= 30) {
      return 'low';
    } else if (score <= 60) {
      return 'medium';
    } else {
      return 'high';
    }
  };

  return (
    <div className="app">
      <Header />
      {/* <h1>CadenceShield: Flow Contract Inspector</h1> */}
      <div className="app-body">
        <div className="code-editor">
          <h2>Paste your code Below...</h2>

          <AceEditor
            mode="java"
            theme="monokai"
            onChange={(newCode) => {
              setCode(newCode);
              setIsCodeEmpty(newCode.trim() === '');
            }}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            width="100%"
            height="calc(100% - 40px)"
            style={{ overflow: 'scroll' }}
            placeholder="Paste your code here..."
          />
            


        </div>
        <div className="analyze-button">
          <button onClick={analyzeCode} disabled={isCodeEmpty}>Analyze</button>
        </div>
        <div className="output">
          <h2 className={getRiskScoreColor(output.risk_score)}>Risk Score: {output.risk_score}</h2>
          <h2>Summary</h2>
          <p>Low: {output.summary?.Low}</p>
          <p>Medium: {output.summary?.Medium}</p>
          <p>High: {output.summary?.High}</p>
          <h2>Vulnerabilities</h2>
          <table>
            <thead>
              <tr>
                <th>Sl. No.</th>
                <th>Impact</th>
                <th>Line Number</th>
                <th>Issue Description</th>
              </tr>
            </thead>
            <tbody>
              {output.vulnerabilities?.map((result, index) => (
                <tr key={index} className={result.impact.toLowerCase()}>
                  <td>{index + 1}</td>
                  <td>{result.impact}</td>
                  <td>{result.line_number}</td>
                  <td>{result.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
