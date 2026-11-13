# Senior Officer 2026 — Online MCQ Examination Platform

A modern, secure, and responsive online computer-based testing (CBT) platform built for competitive examinations.

- **Examination:** Senior Officer 2026 (Recruitment Test — Set A, 100 MCQs)
- **Target Organization:** Uddipok Education
- **Live URL:** https://uddipokeducation.github.io/senior_officer_2026/
- **Repository:** https://github.com/uddipokeducation/senior_officer_2026
- **Database / Backend:** Supabase PostgreSQL & Edge Functions

---

## 1. Examination Scheme & Scoring Architecture

- **Total Questions:** 100 MCQs
- **Duration:** 60 Minutes (with server-synchronized countdown timer)
- **Total Marks:** 100.00
- **Marking Scheme:**
  - Correct Answer: **+1.00 Mark**
  - Incorrect Answer: **−0.25 Mark**
  - Unanswered: **0.00 Mark**
- **Scoring Formula (Server-Side Authoritative):**
  $$\text{Final Score} = (\text{Correct} \times 1.00) - (\text{Incorrect} \times 0.25)$$
  *Scores are displayed to two decimal places and are never clamped to zero (negative scores are retained).*

---

## 2. Security & Anti-Cheating Architecture

1. **Private Answer Keys:** Answer keys are stored in a dedicated `answer_keys` table with strict Row Level Security (RLS). No public SELECT or read policy exists. Candidates can never inspect browser network requests or local memory to reveal answers before submission.
2. **Server-Side Scoring:** Examination scoring is computed exclusively inside Supabase Edge Functions using the Supabase Service Role Key.
3. **Timed Server Expiry:** Examination expiration is tracked on the server (`expires_at`). Local storage timer synchronization ensures candidates cannot reset the countdown timer by refreshing or closing the browser.
4. **Idempotent Submission:** An examination attempt can only be submitted once. Duplicate submissions return the already calculated authoritative score.
5. **Answer Recovery on Refresh:** Responses are mirrored between local client state and the Supabase database in real time so candidates can seamlessly continue if their browser tab closes.

---

## 3. Technology Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Responsive, custom modular CSS with mobile-first layout
- **Routing:** React Router v6 with SPA redirect fallback for GitHub Pages (`404.html` trick)
- **Database:** Supabase PostgreSQL 15 with Row Level Security (RLS)
- **Backend Services:** Supabase Edge Functions (Deno / TypeScript)
- **Hosting & CI/CD:** GitHub Pages with automated GitHub Actions workflow (`deploy.yml`)

---

## 4. Database Architecture

```
examinations
 ├── id (UUID, PK)
 ├── title, description, duration_minutes, total_questions, total_marks
 ├── correct_mark (+1.00), incorrect_mark (-0.25), unanswered_mark (0.00)
 └── is_active, leaderboard_public

questions
 ├── id (UUID, PK)
 ├── examination_id (FK -> examinations.id)
 ├── question_number (1 to 100)
 ├── question_text, option_a, option_b, option_c, option_d
 └── subject, explanation

answer_keys (STRICTLY PRIVATE - NO PUBLIC ACCESS)
 ├── id (UUID, PK)
 ├── question_id (FK -> questions.id)
 └── correct_option ('A' | 'B' | 'C' | 'D')

candidates
 ├── id (UUID, PK)
 ├── full_name, mobile_number, email (UNIQUE)
 └── created_at

exam_attempts
 ├── id (UUID, PK)
 ├── candidate_id (FK -> candidates.id)
 ├── examination_id (FK -> examinations.id)
 ├── started_at, expires_at, submitted_at
 ├── status ('in_progress' | 'submitted' | 'expired')
 └── score, correct_count, incorrect_count, unanswered_count, time_taken_seconds

candidate_responses
 ├── id (UUID, PK)
 ├── attempt_id (FK -> exam_attempts.id)
 ├── question_id (FK -> questions.id)
 ├── selected_option ('A' | 'B' | 'C' | 'D' | NULL)
 └── is_correct (BOOLEAN)

admin_users
 ├── id (UUID, PK, FK -> auth.users.id)
 └── email
```

---

## 5. Supabase Edge Functions

Located in `supabase/functions/`:
- `start-exam`: Validates candidate credentials, creates or resumes attempt, sets authoritative 60-minute expiry time.
- `save-answer`: Real-time persistent answer saving with expiration verification.
- `submit-exam`: Evaluates candidate answers against private answer keys, calculates penalties and final score, updates database records.
- `get-result`: Returns finalized candidate result and detailed answer review (only available for submitted attempts).
- `admin-stats`: Supplies comprehensive analytics, score distribution, question accuracy metrics, and candidate roster to the admin dashboard.

---

## 6. Local Development & Deployment

### Local Setup
```bash
# Clone the repository
git clone https://github.com/uddipokeducation/senior_officer_2026.git
cd senior_officer_2026

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# Run development server
npm run dev
```

### GitHub Pages Deployment
1. Go to repository **Settings** -> **Pages**.
2. Under **Build and deployment**, select **Source: GitHub Actions**.
3. Under **Settings** -> **Secrets and variables** -> **Actions**, add:
   - `VITE_SUPABASE_URL`: `https://nsdjykpnrlxvdfaicqbq.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `<your_anon_key>`
4. Pushing to branch `main` automatically builds and deploys the site.

---

## 7. Applying Database Migrations & Seed Data

In your Supabase project dashboard (SQL Editor) or via Supabase CLI:
1. Run `supabase/migrations/001_initial_schema.sql` to initialize tables, RLS policies, and indexes.
2. Run `supabase/seed.sql` to populate all 100 verified questions and private answer keys for Senior Officer 2026.
3. Deploy Edge Functions using Supabase CLI:
   ```bash
   supabase functions deploy start-exam
   supabase functions deploy save-answer
   supabase functions deploy submit-exam
   supabase functions deploy get-result
   supabase functions deploy admin-stats
   ```
