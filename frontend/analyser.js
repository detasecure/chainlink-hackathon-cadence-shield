async function analyzeCode() {

  var code = codeMirror.getValue();
  // var code = document.getElementById('code').value;
  var output = document.getElementById('output');

  // Send a POST request to your FastAPI application
  var response = await fetch('http://localhost:8080/analyze_flow_cadence_code/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({code: code})
  });

  // Parse the response
  var data = await response.json();

  // Clear previous results
  output.innerHTML = '';

  // Display the results
  if (data.results.vulnerabilities.length === 0) {
    output.textContent = 'No vulnerabilities found.';
  } else {

    var risk_score_div = document.createElement('div');
    risk_score_div.textContent = 'Risk Score: ' + data.results.risk_score;
    output.appendChild(risk_score_div);

    var vulnerability_summary_div = document.createElement('div');
    vulnerability_summary_div.textContent = 'Low: ' + data.results.summary.Low + ' Medium: ' + data.results.summary.Medium + ' High: ' + data.results.summary.High;
    output.appendChild(vulnerability_summary_div);


    for (var i = 0; i < data.results.vulnerabilities.length; i++) {
      var result = data.results.vulnerabilities[i];
      var vulnerability = document.createElement('div');
      vulnerability.textContent = 'Impact: ' + result.impact + ' - ' + 'Line ' + result.line_number + ': ' + result.description + ' - ' + result.line;
      output.appendChild(vulnerability);
    }
  }
}
