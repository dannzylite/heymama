import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  age: number | null;
  pregnancy_week: number | null;
  due_date: string | null;
  location: string | null;
  blood_type: string | null;
  allergies: string | null;
  previous_pregnancies: number | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  updated_at: string;
};

export type Vital = {
  id: string;
  user_id: string;
  weight: number | null;
  bp_systolic: number | null;
  bp_diastolic: number | null;
  heart_rate: number | null;
  recorded_at: string;
};

export type Task = {
  id: string;
  user_id: string;
  task_name: string;
  task_time: string;
  completed: boolean;
  created_at: string;
};

export type CommunityQuestion = {
  id: string;
  user_id: string;
  display_name: string;
  question: string;
  category: string;
  created_at: string;
  answer_count?: number;
};

export type CommunityAnswer = {
  id: string;
  question_id: string;
  user_id: string;
  display_name: string;
  answer: string;
  created_at: string;
};
