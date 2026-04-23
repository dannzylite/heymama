-- ============================================================
-- Community Q&A Tables
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Questions table
CREATE TABLE IF NOT EXISTS community_questions (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  display_name  text NOT NULL DEFAULT 'Anonymous',
  question      text NOT NULL,
  category      text NOT NULL DEFAULT 'General',
  created_at    timestamptz DEFAULT now() NOT NULL
);

-- Answers table
CREATE TABLE IF NOT EXISTS community_answers (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id   uuid REFERENCES community_questions(id) ON DELETE CASCADE NOT NULL,
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  display_name  text NOT NULL DEFAULT 'Anonymous',
  answer        text NOT NULL,
  created_at    timestamptz DEFAULT now() NOT NULL
);

-- ---- Row Level Security ----
ALTER TABLE community_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_answers   ENABLE ROW LEVEL SECURITY;

-- Questions: all authenticated users can read
CREATE POLICY "questions_select" ON community_questions
  FOR SELECT TO authenticated USING (true);

-- Questions: users insert their own
CREATE POLICY "questions_insert" ON community_questions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Questions: users delete their own
CREATE POLICY "questions_delete" ON community_questions
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Answers: all authenticated users can read
CREATE POLICY "answers_select" ON community_answers
  FOR SELECT TO authenticated USING (true);

-- Answers: users insert their own
CREATE POLICY "answers_insert" ON community_answers
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Answers: users delete their own
CREATE POLICY "answers_delete" ON community_answers
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ---- Enable Realtime ----
ALTER PUBLICATION supabase_realtime ADD TABLE community_questions;
ALTER PUBLICATION supabase_realtime ADD TABLE community_answers;
