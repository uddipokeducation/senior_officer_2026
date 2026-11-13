const fs = require('fs');
const content = fs.readFileSync('D:/Uddipok_Education/questions_raw.txt', 'utf8');
const lines = content.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

console.log('Total non-empty lines:', lines.length);

let currentQ = null;
const questions = [];

// Regex for Question start: e.g. "1. The financial crisis...", "21. পাশাপাশি...", "100. Which..."
const qStartRegex = /^(\d+)\.\s*(.+)$/;
const ansRegex = /^Answer:\s*\(([A-D])\)(.*)$/i;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const qMatch = line.match(qStartRegex);
  
  if (qMatch && !line.startsWith('(A)') && !line.startsWith('(B)')) {
    // If we have previous question, push it
    if (currentQ) {
      questions.push(currentQ);
    }
    currentQ = {
      number: parseInt(qMatch[1], 10),
      rawLines: [line],
      qText: qMatch[2],
      optA: '',
      optB: '',
      optC: '',
      optD: '',
      answer: ''
    };
  } else if (currentQ) {
    currentQ.rawLines.push(line);
  }
}
if (currentQ) {
  questions.push(currentQ);
}

console.log('Total questions extracted:', questions.length);
questions.forEach(q => {
  // Let's parse options and answer from rawLines
  let ansFound = false;
  let remainingText = [];
  for (let j = 1; j < q.rawLines.length; j++) {
    const l = q.rawLines[j];
    const aMatch = l.match(ansRegex);
    if (aMatch) {
      q.answer = aMatch[1].toUpperCase();
      ansFound = true;
    } else {
      remainingText.push(l);
    }
  }
  
  const fullOptsStr = remainingText.join(' ');
  // Match (A) ... (B) ... (C) ... (D) ...
  const optMatch = fullOptsStr.match(/\(A\)\s*(.*?)\s*\(B\)\s*(.*?)\s*\(C\)\s*(.*?)\s*\(D\)\s*(.*)/s);
  if (optMatch) {
    q.optA = optMatch[1].trim();
    q.optB = optMatch[2].trim();
    q.optC = optMatch[3].trim();
    q.optD = optMatch[4].trim();
  } else {
    console.log(`Failed to parse options for Q${q.number}:`, remainingText);
  }

  if (!q.answer) {
    console.log(`Missing answer for Q${q.number}!`);
  }
});

console.log('Sample parsed questions:');
console.log(JSON.stringify(questions[0], null, 2));
console.log(JSON.stringify(questions[20], null, 2));
console.log(JSON.stringify(questions[99], null, 2));

// Check any question without 4 options or without answer
const invalid = questions.filter(q => !q.optA || !q.optB || !q.optC || !q.optD || !q.answer);
console.log('Total invalid/incomplete questions:', invalid.length);
if (invalid.length > 0) {
  invalid.forEach(q => console.log(`Issue with Q${q.number}: A=${!!q.optA}, B=${!!q.optB}, C=${!!q.optC}, D=${!!q.optD}, Ans=${q.answer}`));
}
