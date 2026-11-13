const fs = require('fs');
const content = fs.readFileSync('D:/Uddipok_Education/questions_raw.txt', 'utf8');
const lines = content.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

const qStartRegex = /^(\d+)\.\s*(.+)$/;
const ansRegex = /^Answer:\s*\(([A-D])\)(.*)$/i;

let currentQ = null;
const questions = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const qMatch = line.match(qStartRegex);
  
  if (qMatch && !line.startsWith('(A)') && !line.startsWith('(B)')) {
    if (currentQ) questions.push(currentQ);
    currentQ = {
      number: parseInt(qMatch[1], 10),
      rawLines: [line],
      qText: qMatch[2],
      optA: '', optB: '', optC: '', optD: '',
      answer: ''
    };
  } else if (currentQ) {
    currentQ.rawLines.push(line);
  }
}
if (currentQ) questions.push(currentQ);

function getSubject(num) {
  if (num <= 20) return 'English Language & Literature';
  if (num <= 40) return 'বাংলা ভাষা ও সাহিত্য (Bangla)';
  if (num <= 60) return 'Mathematics & Quantitative Aptitude';
  if (num <= 70) return 'Banking, Finance & Economics';
  if (num <= 90) return 'Mental Ability & Logical Reasoning';
  return 'Information & Communication Technology (ICT)';
}

questions.forEach(q => {
  let remainingText = [];
  for (let j = 1; j < q.rawLines.length; j++) {
    const l = q.rawLines[j];
    const aMatch = l.match(ansRegex);
    if (aMatch) {
      q.answer = aMatch[1].toUpperCase();
    } else {
      remainingText.push(l);
    }
  }
  
  const fullOptsStr = remainingText.join(' ');
  const optMatch = fullOptsStr.match(/\(A\)\s*(.*?)\s*\(B\)\s*(.*?)\s*\(C\)\s*(.*?)\s*\(D\)\s*(.*)/s);
  if (optMatch) {
    q.optA = optMatch[1].trim();
    q.optB = optMatch[2].trim();
    q.optC = optMatch[3].trim();
    q.optD = optMatch[4].trim();
  }
  q.subject = getSubject(q.number);
});

function escapeSql(str) {
  if (!str) return '';
  return str.replace(/'/g, "''");
}

let sql = `-- Seed file for Senior Officer 2026 Examination
-- Generated automatically from verified Question Bank Set A (100 Questions)

DO $$
DECLARE
  exam_id UUID := 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'::UUID;
  q_id UUID;
BEGIN
  -- 1. Insert or update the Senior Officer 2026 Examination
  IF NOT EXISTS (SELECT 1 FROM examinations WHERE id = exam_id) THEN
    INSERT INTO examinations (
      id,
      title,
      description,
      total_questions,
      total_marks,
      duration_minutes,
      correct_mark,
      incorrect_mark,
      unanswered_mark,
      is_active,
      leaderboard_public
    ) VALUES (
      exam_id,
      'Senior Officer 2026',
      'Recruitment Test 2026 (MCQ Part) - Post: Senior Officer (General) (9th Grade) | Job ID: 26101 | Set A',
      100,
      100,
      60,
      1.00,
      -0.25,
      0.00,
      true,
      true
    );
  END IF;

`;

questions.forEach(q => {
  sql += `  -- Q${q.number}\n`;
  sql += `  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)\n`;
  sql += `  VALUES (exam_id, ${q.number}, '${escapeSql(q.qText)}', '${escapeSql(q.optA)}', '${escapeSql(q.optB)}', '${escapeSql(q.optC)}', '${escapeSql(q.optD)}', '${escapeSql(q.subject)}')\n`;
  sql += `  ON CONFLICT (examination_id, question_number) DO UPDATE SET\n`;
  sql += `    question_text = EXCLUDED.question_text,\n`;
  sql += `    option_a = EXCLUDED.option_a,\n`;
  sql += `    option_b = EXCLUDED.option_b,\n`;
  sql += `    option_c = EXCLUDED.option_c,\n`;
  sql += `    option_d = EXCLUDED.option_d,\n`;
  sql += `    subject = EXCLUDED.subject\n`;
  sql += `  RETURNING id INTO q_id;\n\n`;

  sql += `  INSERT INTO answer_keys (question_id, correct_option)\n`;
  sql += `  VALUES (q_id, '${q.answer}')\n`;
  sql += `  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;\n\n`;
});

sql += `END $$;\n`;

fs.writeFileSync('D:/senior_officer_2026/supabase/seed.sql', sql, 'utf8');
console.log('Seed SQL generated successfully. File size:', sql.length, 'bytes');

// Also save questions as a secure JSON file for local dev or tests if needed
const publicQuestions = questions.map(q => ({
  question_number: q.number,
  question_text: q.qText,
  option_a: q.optA,
  option_b: q.optB,
  option_c: q.optC,
  option_d: q.optD,
  subject: q.subject
}));
fs.writeFileSync('D:/senior_officer_2026/src/data/questions_public.json', JSON.stringify(publicQuestions, null, 2), 'utf8');
console.log('Public questions JSON (NO ANSWERS) generated for offline fallback.');
