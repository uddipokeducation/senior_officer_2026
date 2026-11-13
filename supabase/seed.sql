-- Seed file for Senior Officer 2026 Examination
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

  -- Q1
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 1, 'The financial crisis could have been averted, ______ the regulatory authorities acted promptly upon receiving the preliminary warning.', 'unless', 'had', 'should', 'were', 'English Language & Literature')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q2
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 2, 'Had the researchers anticipated the methodological limitations of their initial design, they ______ a more comprehensive sampling strategy before commencing data collection.', 'would adopt', 'would have adopted', 'had adopted', 'will have adopted', 'English Language & Literature')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q3
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 3, 'The committee''s recommendations were predicated ______ the assumption that the institution would receive substantial financial assistance from external agencies.', 'upon', 'with', 'at', 'for', 'English Language & Literature')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'A')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q4
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 4, 'The criteria by which the applications ______ evaluated ______ clearly specified in the official guidelines.', 'is; are', 'are; is', 'is; is', 'are; are', 'English Language & Literature')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'D')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q5
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 5, 'Choose the correct passive form: The authorities ought to have informed the affected residents about the potential environmental hazards.', 'The affected residents ought to be informed about the potential environmental hazards.', 'The affected residents ought to have informed about the potential environmental hazards.', 'The affected residents ought to have been informed about the potential environmental hazards.', 'The affected residents ought to have being informed about the potential environmental hazards.', 'English Language & Literature')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'C')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q6
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 6, 'The professor remarked that he had never encountered such an inconsistency in his previous research. Choose the most appropriate direct speech.', 'The professor remarked, “I never encountered such an inconsistency in my previous research.”', 'The professor remarked, “I have never encountered such an inconsistency in my previous research.”', 'The professor remarked, “I had never encountered such an inconsistency in my previous research.”', 'The professor remarked, “I would never have encountered such an inconsistency in my previous research.”', 'English Language & Literature')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q7
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 7, 'Choose the correct use of ‘Despite’: Although the investigators were under considerable political pressure, they refused to alter their findings.', 'Despite being under considerable political pressure, the investigators refused to alter their findings.', 'Despite were under considerable political pressure, the investigators refused to alter their findings.', 'Despite of being under considerable political pressure, the investigators refused to alter their findings.', 'Despite having been under considerable political pressure, the investigators had refused to alter their findings.', 'English Language & Literature')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'A')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q8
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 8, 'The independent commission recommended that the findings of the preliminary investigation ______ publicly disclosed until the identities of the confidential informants had been adequately protected.', 'are not', 'not be', 'were not', 'not being', 'English Language & Literature')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q9
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 9, 'The supervisor would rather the researchers ______ the preliminary findings at yesterday''s conference, given the unresolved methodological concerns.', 'did not present', 'had not presented', 'would not present', 'have not presented', 'English Language & Literature')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q10
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 10, 'Choose the appropriate noun form of ‘Feasible’:', 'Feasible', 'Feasibility', 'Feasibilization', 'Feasibly', 'English Language & Literature')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q11
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 11, 'What is the closest antonym of ‘Exacerbate’?', 'Alleviate', 'Suppress', 'Neutralize', 'Prevent', 'English Language & Literature')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'A')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q12
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 12, 'The neighbors were ______ by the noise from the construction.', 'aggravated', 'invigorated', 'castigated', 'incarcerated', 'English Language & Literature')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'A')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q13
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 13, 'His short stories ______ the political tensions prevalent in his contemporary times.', 'abound in', 'partake of', 'steeped in', 'sparked off', 'English Language & Literature')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'A')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q14
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 14, 'The new high-speed rail service encouraged thousands of passengers to ______ from bus travel.', 'switch off', 'switch over', 'switch around', 'be switched on', 'English Language & Literature')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q15
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 15, 'He is infamous for poking fun at students'' weaknesses with ______ remarks.', 'sarcastic', 'constructive', 'uncynical', 'optimistic', 'English Language & Literature')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'A')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q16
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 16, 'Which of the following is correct?', 'That he was foreign made it difficult for him to get the job.', 'I realized the importance that we should be there in time.', 'They insisted that he leave the room at once.', 'I am sending you the book, as it was agreed.', 'English Language & Literature')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'C')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q17
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 17, 'Which of the following is correct?', 'I am feeling they should not start now.', 'We will be happy for her to help him.', 'May everybody apply for this post?', 'It is probable for him to be in good temper.', 'English Language & Literature')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q18
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 18, 'It was the first time that they ______ to Cox''s Bazaar.', 'had been', 'have been', 'were', 'visited', 'English Language & Literature')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'A')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q19
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 19, 'I tried two shirts, ______ fitted me.', 'neither of them', 'none of these', 'neither of which', 'both of them', 'English Language & Literature')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'C')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q20
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 20, 'We haven''t met you for ______.', 'such a long time', 'so long time', 'such long time', 'so many times', 'English Language & Literature')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'A')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q21
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 21, 'পাশাপাশি দুটি স্বরধ্বনি একটি সংযুক্ত ধ্বনিরূপে উচ্চারিত হলে, প্রথম স্বরটি দ্বিতীয়টির চেয়ে দীর্ঘ ও স্পষ্ট। এটি কোনটির লক্ষণ?', 'অনুনাসিক স্বরধ্বনি', 'মধ্যস্বরাগম', 'মৌলিক স্বরধ্বনি', 'দ্বিস্বরধ্বনি', 'বাংলা ভাষা ও সাহিত্য (Bangla)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'D')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q22
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 22, '‘জ্বলন্ত আগুন’, ‘রেশমি চাদর’, ‘সপ্তদশ শতাব্দী’ — বিশেষণের অর্থভিত্তিক শ্রেণি যথাক্রমে কোনটি?', 'গুণবাচক-অবস্থাবাচক-সংখ্যাবাচক', 'অবস্থাবাচক-গুণবাচক-ক্রমবাচক', 'অবস্থাবাচক-উপাদানবাচক-ক্রমবাচক', 'গুণবাচক-উপাদানবাচক-পরিমাণবাচক', 'বাংলা ভাষা ও সাহিত্য (Bangla)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'C')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q23
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 23, '‘দাতা’, ‘পঠিত’ ও ‘পাঠক’ — প্রত্যয়যোগে গঠিত শব্দগুলোর পদশ্রেণি যথাক্রমে কোনটি?', 'বিশেষণ-বিশেষ্য-বিশেষণ', 'বিশেষ্য-বিশেষ্য-বিশেষণ', 'বিশেষণ-বিশেষণ-বিশেষ্য', 'বিশেষ্য-বিশেষণ-বিশেষ্য', 'বাংলা ভাষা ও সাহিত্য (Bangla)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'D')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q24
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 24, '‘লাল জামা’ এবং ‘জামাটি লাল’ — দুই প্রয়োগে ‘লাল’ শব্দের অবস্থানভিত্তিক শ্রেণি যথাক্রমে কী?', 'বিধেয় বিশেষণ-সাক্ষাৎ বিশেষণ', 'নাম বিশেষণ-ভাববিশেষণ', 'ভাব বিশেষণ-নামবিশেষণ', 'সাক্ষাৎ বিশেষণ-বিধেয় বিশেষণ', 'বাংলা ভাষা ও সাহিত্য (Bangla)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'D')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q25
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 25, '‘আমি স্বয়ং যাব’ — এই বাক্যে ‘স্বয়ং’ কোন সর্বনাম?', 'ব্যক্তিবাচক', 'নির্দেশক', 'আত্মবাচক', 'প্রশ্নবাচক', 'বাংলা ভাষা ও সাহিত্য (Bangla)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'C')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q26
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 26, '‘ফি-সন’ শব্দে ‘ফি’ কী অর্থে ব্যবহৃত?', 'প্রতি', 'বিনা', 'বিপরীত', 'অধিক', 'বাংলা ভাষা ও সাহিত্য (Bangla)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'A')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q27
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 27, 'কোন জোড়ায় প্রথমটি দ্বিগু, দ্বিতীয়টি বহুব্রীহি?', 'দশানন—ত্রিফলা', 'মনমাঝি—সপ্তাহ', 'মুখচন্দ্র—ত্রিপদী', 'ত্রিফলা—আয়তলোচনা', 'বাংলা ভাষা ও সাহিত্য (Bangla)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'D')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q28
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 28, '‘অক্ষয় বট’ বাগধারায় কী বোঝায়?', 'দীর্ঘজীবী ব্যক্তি', 'অবিনাশী প্রতিষ্ঠান', 'প্রাচীন বংশ', 'বিশাল বৃক্ষ', 'বাংলা ভাষা ও সাহিত্য (Bangla)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'A')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q29
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 29, '‘মৃগ’ শব্দের অর্থ যেকোনো পশু থেকে ‘হরিণ’ হওয়া কোন প্রক্রিয়া?', 'অর্থপ্রসার', 'অর্থসংক্রম', 'অর্থসংকোচ', 'অর্থের উন্নতি', 'বাংলা ভাষা ও সাহিত্য (Bangla)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'C')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q30
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 30, '‘অনুসন্ধানের ইচ্ছা’ — এর বাক্য সংকোচন কোনটি?', 'অনুসন্ধান', 'অনুসন্ধিৎসা', 'অনুধাবন', 'অন্বেষণ', 'বাংলা ভাষা ও সাহিত্য (Bangla)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q31
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 31, 'কোন বানানটি শুদ্ধ?', 'পৌনঃপুনিক', 'পৌনপুনিক', 'পৌনঃপূনীক', 'পোনঃপুনিক', 'বাংলা ভাষা ও সাহিত্য (Bangla)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'A')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q32
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 32, 'সারাংশে মূলের প্রত্যক্ষ উক্তি কীভাবে লিখতে হয়?', 'উদ্ধৃতি চিহ্নে', 'পরোক্ষ উক্তিতে', 'সংলাপ আকারে', 'অপরিবর্তিতভাবে', 'বাংলা ভাষা ও সাহিত্য (Bangla)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q33
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 33, '‘হকিকত-ই-মুসলমান-ই-বাঙ্গালা’ (১৮৯৬) গ্রন্থের লেখক কে?', 'কাজী আবদুল ওদুদ', 'দেওয়ান খোন্দকার ফজলে রাব্বি', 'আবুল হোসেন', 'খান বাহাদুর আবদুর রহমান খাঁ', 'বাংলা ভাষা ও সাহিত্য (Bangla)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q34
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 34, 'নিচের কোনটি দ্বিস্বর ধ্বনি নয়?', 'বিধি', 'রিষ্টি', 'রদ', 'ইয়ে', 'বাংলা ভাষা ও সাহিত্য (Bangla)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'C')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q35
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 35, 'নিচের কোনটির সন্ধিবিচ্ছেদ ঠিকভাবে হয়নি?', 'ষষ্ + থ = ষষ্ঠ', 'যথা + ইষ্ট = যথেষ্ট', 'শরৎ + চন্দ্র = শরৎচন্দ্র', 'মৃত্যু + জয় = মৃত্যুঞ্জয়', 'বাংলা ভাষা ও সাহিত্য (Bangla)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'C')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q36
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 36, '‘কাগজ’ শব্দটি কোন ভাষা হতে আগত?', 'ফারসি', 'উর্দু', 'আরবি', 'তুর্কি', 'বাংলা ভাষা ও সাহিত্য (Bangla)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'A')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q37
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 37, 'আর হায় হায় করে লাভ কী? — এ বাক্যে ‘হায় হায়’ কোন অর্থ প্রকাশ করছে?', 'ভাবের প্রগাঢ়তা', 'ভাবের গভীরতা', 'তীব্রতা', 'পৌনঃপুনিকতা', 'বাংলা ভাষা ও সাহিত্য (Bangla)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'D')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q38
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 38, 'ব্যধিকরণ বহুব্রীহি সমাসের উদাহরণ কোনটি?', 'খোশ মেজাজ যার', 'হাতে খড়ি যার', 'কানে কানে যে কথা', 'রত্ন গর্ভে যার', 'বাংলা ভাষা ও সাহিত্য (Bangla)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'D')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q39
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 39, '‘ষ্ণ’ প্রত্যয়যুক্ত শব্দে মূল স্বরের কী হয়?', 'হ্রাস', 'বৃদ্ধি', 'দ্বিগুণ', 'গুণ', 'বাংলা ভাষা ও সাহিত্য (Bangla)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q40
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 40, 'লেখার সময় কোনো কথা অব্যক্ত রাখতে চাইলে কোন বিরামচিহ্ন ব্যবহার করতে হয়?', 'বিন্দু', 'ত্রিবিন্দু', 'কমা', 'কোলন', 'বাংলা ভাষা ও সাহিত্য (Bangla)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q41
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 41, 'In a triangle, the second angle is three times the first angle, and the third angle is 20° more than the first angle. Find the first angle.', '28°', '32°', '36°', '40°', 'Mathematics & Quantitative Aptitude')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q42
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 42, 'A rectangular tank 20 m × 10 m × 6 m is filled with water. The water is poured into cylindrical cans of radius 1 m and height 2 m. How many cans are needed?', '150', '200', '300', '400', 'Mathematics & Quantitative Aptitude')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q43
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 43, 'A student who scores 40% fails by 30 marks. Another student who scores 60% gets 30 marks more than the pass mark. What is the total marks of the examination?', '100', '150', '300', '600', 'Mathematics & Quantitative Aptitude')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'C')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q44
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 44, 'Two numbers are in the ratio 4:7 and their sum is 220. What is the smaller number?', '80', '84', '88', '96', 'Mathematics & Quantitative Aptitude')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'A')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q45
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 45, 'A man sold a watch at a 5% loss. If he had received Tk. 50 more, he would have sold it at no profit and no loss. Find the cost price.', 'Tk. 400', 'Tk. 600', 'Tk. 800', 'Tk. 1000', 'Mathematics & Quantitative Aptitude')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'D')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q46
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 46, 'Find the value of lim (x→0) sin 3x / x.', '1', '3', '1/3', '0', 'Mathematics & Quantitative Aptitude')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q47
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 47, 'Find the value of (1 + i)⁸, where i = √−1.', '8', '16', '−16', '8i', 'Mathematics & Quantitative Aptitude')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q48
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 48, 'Two fair dice are rolled. What is the probability that the sum of the numbers is 7?', '1/6', '5/36', '1/12', '7/36', 'Mathematics & Quantitative Aptitude')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'A')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q49
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 49, 'Find the remainder when 2¹⁰ is divided by 7.', '1', '2', '4', '6', 'Mathematics & Quantitative Aptitude')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q50
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 50, 'Solve log₂(x) + log₂(x − 2) = 3 for x > 2.', '2', '4', '−2', '8', 'Mathematics & Quantitative Aptitude')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q51
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 51, 'Find the average value of f(x) = x² on the interval [0, 3].', '3', '9/2', '9', '2', 'Mathematics & Quantitative Aptitude')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'A')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q52
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 52, 'How many distinct arrangements are there of the letters of the word “LEVEL”?', '30', '60', '120', '20', 'Mathematics & Quantitative Aptitude')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'A')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q53
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 53, 'Tk 12,600 is divided among X, Y and Z. X gets 2/3 of what Y gets, and Y gets 3/4 of what Z gets. Find each person''s share.', 'X Tk 3,000; Y Tk 4,000; Z Tk 5,600', 'X Tk 2,800; Y Tk 4,200; Z Tk 5,600', 'X Tk 2,600; Y Tk 4,200; Z Tk 5,800', 'X Tk 2,400; Y Tk 4,600; Z Tk 5,600', 'Mathematics & Quantitative Aptitude')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q54
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 54, 'A customer pays Tk 41,400 for a refrigerator, including 15% VAT, after a 10% discount on the list price. Find the list price.', 'Tk 45,000', 'Tk 40,000', 'Tk 36,000', 'Tk 38,000', 'Mathematics & Quantitative Aptitude')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q55
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 55, 'Two articles are sold at Tk 1,200 each. One is sold at a 20% profit and the other at a 20% loss. Find the overall gain or loss percentage.', '4% loss', '4% gain', 'No gain, no loss', '2% loss', 'Mathematics & Quantitative Aptitude')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'A')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q56
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 56, 'The difference between the compound interest and the simple interest on a sum for 2 years at 8% per annum is Tk 96. Find the sum.', 'Tk 12,000', 'Tk 18,000', 'Tk 20,000', 'Tk 15,000', 'Mathematics & Quantitative Aptitude')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'D')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q57
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 57, 'Find the smallest number which leaves remainder 7 when divided by 12, 15 or 20, and is exactly divisible by 11.', '187', '127', '247', '307', 'Mathematics & Quantitative Aptitude')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'A')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q58
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 58, 'Two kinds of tea cost Tk 120 and Tk 150 per kg. In what ratio should they be mixed so that selling the mixture at Tk 156 per kg gives a 20% profit?', '1 : 2', '3 : 2', '1 : 1', '2 : 1', 'Mathematics & Quantitative Aptitude')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'D')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q59
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 59, 'A machine loses 10% of its value every year. Its value after 2 years is Tk 48,600. What was its original value?', 'Tk 58,320', 'Tk 54,000', 'Tk 60,000', 'Tk 64,000', 'Mathematics & Quantitative Aptitude')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'C')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q60
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 60, 'A rectangular field is 120 m long and 80 m wide. A path 4 m wide runs all around outside it. Find the cost of paving the path at Tk 150 per square metre.', 'Tk 192,000', 'Tk 249,600', 'Tk 240,000', 'Tk 260,400', 'Mathematics & Quantitative Aptitude')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q61
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 61, 'Under Bangladesh Bank''s revised rule effective from April 2025, a loan becomes classified (non-performing) once it is overdue for:', '30 days', '90 days', '180 days', '270 days', 'Banking, Finance & Economics')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q62
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 62, 'Which DSE index tracks Shariah-compliant listed companies?', 'DS30', 'DSEX', 'DSES', 'CDSET', 'Banking, Finance & Economics')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'C')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q63
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 63, 'In Bangladesh Bank''s interest rate corridor, the floor is set by the:', 'Repo rate', 'Standing Lending Facility', 'Bank rate', 'Standing Deposit Facility', 'Banking, Finance & Economics')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'D')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q64
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 64, 'Under Basel III in Bangladesh, the minimum total capital requirement, including the capital conservation buffer, is:', '8%', '10%', '10.5%', '12.5%', 'Banking, Finance & Economics')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'D')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q65
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 65, 'Which risk cannot be eliminated through diversification?', 'Business Risk', 'Financial Risk', 'Unsystematic Risk', 'Systematic Risk', 'Banking, Finance & Economics')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'D')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q66
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 66, 'Which of the following is a money market instrument?', 'Ordinary Share', 'Preference Share', 'Treasury Bill', 'Long-term Corporate Bond', 'Banking, Finance & Economics')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'C')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q67
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 67, 'Which international framework establishes capital adequacy and liquidity standards for banks?', 'IFRS', 'Basel III', 'UCP 600', 'ISO 9001', 'Banking, Finance & Economics')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q68
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 68, 'Which of the following is the full form of SWIFT in international banking?', 'Society for Worldwide Interbank Financial Transactions', 'Society for Worldwide Interbank Financial Telecommunication', 'System for Worldwide International Fund Transfer', 'Society for World Investment and Financial Technology', 'Banking, Finance & Economics')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q69
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 69, 'Which Shariah principle is used for mobilizing current deposits by Islamic banks in Bangladesh?', 'Mudaraba', 'Musharaka', 'Al-Wadiah', 'Bi-Salam', 'Banking, Finance & Economics')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'C')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q70
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 70, 'Which of the following best describes the RTGS system?', 'Batch processing of low-value transactions', 'Real-time settlement of individual transactions on a gross basis', 'Settlement of transactions only at the end of each month', 'Processing of cheque images', 'Banking, Finance & Economics')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q71
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 71, 'What comes next in the series: 3, 7, 15, 31, 63, …?', '126', '127', '128', '129', 'Mental Ability & Logical Reasoning')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q72
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 72, 'Which letter comes next in the series: A, C, F, J, O, …?', 'R', 'S', 'T', 'U', 'Mental Ability & Logical Reasoning')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'D')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q73
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 73, 'Statements: (I) All doctors are graduates. (II) Some graduates are teachers. Conclusions: (I) Some doctors are teachers. (II) Some teachers are graduates. Which of the following logically follows?', 'Only conclusion I follows', 'Only conclusion II follows', 'Both conclusions follow', 'Neither conclusion follows', 'Mental Ability & Logical Reasoning')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q74
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 74, 'Statements: (I) No cat is a dog. (II) Some dogs are animals. Conclusions: (I) Some animals are not cats. (II) No animal is a cat. Which of the following logically follows?', 'Only conclusion I follows', 'Both conclusions follow', 'Only conclusion II follows', 'Neither conclusion follows', 'Mental Ability & Logical Reasoning')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'A')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q75
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 75, 'A man walks 10 km north, turns right and walks 6 km, then turns right again and walks 10 km. How far is he from his starting point, and in which direction?', '6 km east', '6 km west', '10 km south', '16 km north-east', 'Mental Ability & Logical Reasoning')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'A')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q76
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 76, 'In a certain code, LOGIC is written as MQJMH. How would MIND be written in the same code?', 'NJQM', 'NKPH', 'OKQH', 'NKQH', 'Mental Ability & Logical Reasoning')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'D')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q77
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 77, 'Among five friends, Tania is taller than Rifa but shorter than Mitu. Sabbir is taller than Mitu but shorter than Nabil. Who is the second tallest?', 'Mitu', 'Sabbir', 'Nabil', 'Tania', 'Mental Ability & Logical Reasoning')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q78
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 78, 'In a group of 100 people, 60 like tea, 45 like coffee, and 15 like neither. How many people like both tea and coffee?', '20', '25', '30', '35', 'Mental Ability & Logical Reasoning')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'A')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q79
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 79, 'A company''s annual sales (in thousand units) were 40 in 2021, 50 in 2022, 45 in 2023, and 63 in 2024. What was the percentage increase in sales from 2023 to 2024?', '18%', '28.6%', '40%', '45%', 'Mental Ability & Logical Reasoning')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'C')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q80
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 80, 'Statement I: 2x + y = 10. Statement II: y = 4. To find the value of x, which of the following is correct?', 'Statements I and II together are sufficient, but neither alone is sufficient.', 'Statement I alone is sufficient.', 'Statement II alone is sufficient.', 'Statements I and II together are not sufficient.', 'Mental Ability & Logical Reasoning')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'A')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q81
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 81, 'A manager argues: “We should move all staff to remote work, because it will cut our office rental costs.” Which of the following is an assumption underlying this argument?', 'Most employees prefer working from home.', 'Competing firms have already adopted remote work.', 'Remote work will not create costs or productivity losses large enough to cancel out the rent savings.', 'Office rent is the company''s largest single expense.', 'Mental Ability & Logical Reasoning')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'C')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q82
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 82, 'A city council argues that building a new flyover will ease traffic congestion in the city centre. Which of the following, if true, most weakens this argument?', 'The flyover will take about two years to build.', 'The flyover will be built with locally sourced materials.', 'A majority of residents support the project.', 'In comparable cities, new flyovers attracted additional vehicles and congestion returned within a year.', 'Mental Ability & Logical Reasoning')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'D')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q83
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 83, 'In a survey of 500 employees at a firm, 80% said flexible working hours improve their job satisfaction. After the firm introduced flexible hours, staff turnover fell by 15% over the next year. Which conclusion is best supported by this information?', 'Flexible hours were the only reason turnover fell.', 'Flexible hours may have contributed to the fall in turnover.', 'Every employee became more satisfied with their job.', 'The firm''s productivity rose by 15%.', 'Mental Ability & Logical Reasoning')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q84
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 84, 'If the day after the day after tomorrow is Sunday, what day was it the day before yesterday?', 'Sunday', 'Tuesday', 'Wednesday', 'Monday', 'Mental Ability & Logical Reasoning')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q85
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 85, 'Which of the following numbers does not belong with the other three?', '13', '17', '19', '21', 'Mental Ability & Logical Reasoning')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'D')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q86
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 86, 'A boy, looking at a person in a photograph, says, “He is the son of my paternal grandfather''s only daughter.” How is the person in the photograph related to the boy?', 'He is his cousin (specifically, his paternal aunt''s son)', 'He is his brother', 'He is not a relative of him', 'He is his uncle', 'Mental Ability & Logical Reasoning')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'A')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q87
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 87, 'When a wall clock shows the time 6:30, what is the angle (in degrees) between the hour hand and the minute hand?', '0°', '25°', '15°', '30°', 'Mental Ability & Logical Reasoning')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'C')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q88
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 88, 'A 30% solution and a 50% solution are mixed to produce 40 litres of a 42% solution. How many litres of the 50% solution are required?', '20', '24', '28', '32', 'Mental Ability & Logical Reasoning')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q89
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 89, 'A committee of 4 people is to be selected from 5 men and 6 women. How many different committees can be formed if at least two women must be included?', '220', '235', '250', '265', 'Mental Ability & Logical Reasoning')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'D')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q90
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 90, 'In a survey of 180 customers, 90 use mobile banking, 80 use internet banking and 70 use card services. Of these, 40 use both mobile and internet banking, 35 use both mobile banking and card services, 30 use both internet banking and card services, and 20 use all three. How many customers use none of these services?', '15', '20', '25', '30', 'Mental Ability & Logical Reasoning')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'C')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q91
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 91, 'Which number system is primarily used internally by digital computers?', 'Decimal', 'Octal', 'Binary', 'Hexadecimal', 'Information & Communication Technology (ICT)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'C')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q92
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 92, 'What is the decimal equivalent of the binary number 1010?', '8', '10', '12', '14', 'Information & Communication Technology (ICT)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q93
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 93, 'Which protocol is used to securely transfer web pages between a browser and a web server?', 'FTP', 'SMTP', 'HTTPS', 'POP3', 'Information & Communication Technology (ICT)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'C')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q94
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 94, 'Which of the following provides an additional layer of security beyond a password?', 'Browser Cache', 'File Compression', 'Two-Factor Authentication', 'Disk Defragmentation', 'Information & Communication Technology (ICT)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'C')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q95
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 95, 'Which of the following is an example of cloud computing?', 'Using a calculator offline', 'Storing files in Google Drive', 'Printing a document', 'Installing additional RAM', 'Information & Communication Technology (ICT)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q96
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 96, 'Which of the following best describes Machine Learning?', 'A method of physically repairing computers', 'A technique for increasing Internet bandwidth', 'A process of manually entering data into databases', 'A method enabling computers to learn patterns from data', 'Information & Communication Technology (ICT)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'D')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q97
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 97, 'The speed of a processor is measured in ______.', 'Hertz', 'Byte', 'Bit', 'Pixel', 'Information & Communication Technology (ICT)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'A')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q98
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 98, 'Which of the following is an example of system software?', 'MS Word', 'Windows 11', 'Adobe Photoshop', 'Google Chrome', 'Information & Communication Technology (ICT)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'B')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q99
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 99, 'Which protocol is used for sending emails?', 'HTTP', 'FTP', 'SMTP', 'POP3', 'Information & Communication Technology (ICT)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'C')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

  -- Q100
  INSERT INTO questions (examination_id, question_number, question_text, option_a, option_b, option_c, option_d, subject)
  VALUES (exam_id, 100, 'Which technology allows multiple users to share one physical machine?', 'Cloud Computing', 'Blockchain', 'Machine Learning', 'Internet of Things', 'Information & Communication Technology (ICT)')
  ON CONFLICT (examination_id, question_number) DO UPDATE SET
    question_text = EXCLUDED.question_text,
    option_a = EXCLUDED.option_a,
    option_b = EXCLUDED.option_b,
    option_c = EXCLUDED.option_c,
    option_d = EXCLUDED.option_d,
    subject = EXCLUDED.subject
  RETURNING id INTO q_id;

  INSERT INTO answer_keys (question_id, correct_option)
  VALUES (q_id, 'A')
  ON CONFLICT (question_id) DO UPDATE SET correct_option = EXCLUDED.correct_option;

END $$;
