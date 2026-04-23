import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MessageSquare, Users, Send, Loader2, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase, CommunityQuestion, CommunityAnswer } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const CATEGORIES = [
  "Symptoms",
  "Nutrition",
  "Monitoring",
  "Emergency",
  "Mental Health",
  "General",
];

function timeAgo(ts: string) {
  const secs = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

export function CommunityQA() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [questions, setQuestions] = useState<CommunityQuestion[]>([]);
  const [answerCounts, setAnswerCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Ask question dialog
  const [askOpen, setAskOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [submittingQ, setSubmittingQ] = useState(false);

  // View answers dialog
  const [viewQuestion, setViewQuestion] = useState<CommunityQuestion | null>(null);
  const [answers, setAnswers] = useState<CommunityAnswer[]>([]);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [newAnswer, setNewAnswer] = useState("");
  const [submittingA, setSubmittingA] = useState(false);

  const answersEndRef = useRef<HTMLDivElement>(null);

  // ── Fetch all questions + answer counts ──────────────────────────────────
  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from("community_questions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Failed to load questions", variant: "destructive" });
      return;
    }

    const qs = data as CommunityQuestion[];
    setQuestions(qs);

    if (qs.length > 0) {
      const { data: counts } = await supabase
        .from("community_answers")
        .select("question_id")
        .in("question_id", qs.map((q) => q.id));

      const map: Record<string, number> = {};
      (counts ?? []).forEach((r: { question_id: string }) => {
        map[r.question_id] = (map[r.question_id] ?? 0) + 1;
      });
      setAnswerCounts(map);
    }

    setLoading(false);
  };

  // ── Fetch answers for a question ─────────────────────────────────────────
  const fetchAnswers = async (questionId: string) => {
    setLoadingAnswers(true);
    const { data, error } = await supabase
      .from("community_answers")
      .select("*")
      .eq("question_id", questionId)
      .order("created_at", { ascending: true });

    if (!error) setAnswers((data as CommunityAnswer[]) ?? []);
    setLoadingAnswers(false);
  };

  // ── Initial load + realtime subscriptions ────────────────────────────────
  useEffect(() => {
    fetchQuestions();

    const qChannel = supabase
      .channel("community_questions_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "community_questions" },
        fetchQuestions
      )
      .subscribe();

    return () => { supabase.removeChannel(qChannel); };
  }, []);

  // Realtime for answers when the dialog is open
  useEffect(() => {
    if (!viewQuestion) return;

    fetchAnswers(viewQuestion.id);

    const aChannel = supabase
      .channel(`answers_${viewQuestion.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "community_answers",
          filter: `question_id=eq.${viewQuestion.id}`,
        },
        () => fetchAnswers(viewQuestion.id)
      )
      .subscribe();

    return () => { supabase.removeChannel(aChannel); };
  }, [viewQuestion?.id]);

  // Scroll to latest answer
  useEffect(() => {
    answersEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [answers]);

  // ── Get user display name ─────────────────────────────────────────────────
  const getDisplayName = async (): Promise<string> => {
    if (!user) return "Anonymous";
    const { data } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();
    return (data as any)?.full_name || user.email?.split("@")[0] || "Anonymous";
  };

  // ── Submit new question ───────────────────────────────────────────────────
  const handleAskQuestion = async () => {
    if (!newQuestion.trim() || !user) return;
    setSubmittingQ(true);

    const displayName = await getDisplayName();
    const { error } = await supabase.from("community_questions").insert({
      user_id: user.id,
      display_name: displayName,
      question: newQuestion.trim(),
      category: newCategory,
    });

    if (error) {
      toast({ title: "Failed to post question", variant: "destructive" });
    } else {
      toast({ title: "Question posted!", description: "The community can now see and answer your question." });
      setNewQuestion("");
      setNewCategory("General");
      setAskOpen(false);
    }
    setSubmittingQ(false);
  };

  // ── Submit answer ─────────────────────────────────────────────────────────
  const handleSubmitAnswer = async () => {
    if (!newAnswer.trim() || !viewQuestion || !user) return;
    setSubmittingA(true);

    const displayName = await getDisplayName();
    const { error } = await supabase.from("community_answers").insert({
      question_id: viewQuestion.id,
      user_id: user.id,
      display_name: displayName,
      answer: newAnswer.trim(),
    });

    if (error) {
      toast({ title: "Failed to post answer", variant: "destructive" });
    } else {
      setNewAnswer("");
      setAnswerCounts((prev) => ({
        ...prev,
        [viewQuestion.id]: (prev[viewQuestion.id] ?? 0) + 1,
      }));
    }
    setSubmittingA(false);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Ask Question Banner */}
      <Card className="shadow-card bg-gradient-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Have a Question?</h3>
              <p className="text-muted-foreground text-sm">
                Ask our community of mothers and healthcare professionals
              </p>
            </div>
            <Button onClick={() => setAskOpen(true)} className="bg-gradient-primary hover:shadow-glow">
              <MessageSquare className="h-4 w-4 mr-2" />
              Ask Question
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Community Questions</h3>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {!loading && questions.length === 0 && (
          <Card className="shadow-card bg-gradient-card text-center p-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No questions yet. Be the first to ask!</p>
          </Card>
        )}

        {!loading &&
          questions.map((q) => (
            <Card
              key={q.id}
              className="shadow-card bg-gradient-card hover:shadow-medical transition-all"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground mb-2">{q.question}</h4>
                    <div className="flex items-center flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {answerCounts[q.id] ?? 0} answers
                      </span>
                      <span>Asked by {q.display_name}</span>
                      <span>{timeAgo(q.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline">{q.category}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewQuestion(q)}
                    >
                      View Answers
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* ── Ask Question Dialog ──────────────────────────────────────── */}
      <Dialog open={askOpen} onOpenChange={setAskOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ask the Community</DialogTitle>
            <DialogDescription>
              Your question will be visible to all members. Be specific for the best answers.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Your Question</label>
              <Textarea
                placeholder="What would you like to know? e.g. Is it normal to have headaches in the third trimester?"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setAskOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAskQuestion}
                disabled={!newQuestion.trim() || submittingQ}
                className="bg-gradient-primary hover:shadow-glow"
              >
                {submittingQ ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Post Question
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── View Answers Dialog ──────────────────────────────────────── */}
      <Dialog open={!!viewQuestion} onOpenChange={(open) => !open && setViewQuestion(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="pr-6">{viewQuestion?.question}</DialogTitle>
            <DialogDescription className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">{viewQuestion?.category}</Badge>
              <span>Asked by {viewQuestion?.display_name}</span>
              {viewQuestion && <span>{timeAgo(viewQuestion.created_at)}</span>}
            </DialogDescription>
          </DialogHeader>

          {/* Answers scroll area */}
          <div className="flex-1 overflow-y-auto space-y-3 py-2 min-h-0">
            {loadingAnswers && (
              <div className="flex justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            )}

            {!loadingAnswers && answers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No answers yet — be the first to help!
              </div>
            )}

            {!loadingAnswers &&
              answers.map((a) => (
                <div
                  key={a.id}
                  className={`p-4 rounded-lg border ${
                    a.user_id === user?.id
                      ? "bg-primary/10 border-primary/20 ml-6"
                      : "bg-muted/40 border-border"
                  }`}
                >
                  <p className="text-sm text-foreground">{a.answer}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {a.display_name} · {timeAgo(a.created_at)}
                  </p>
                </div>
              ))}
            <div ref={answersEndRef} />
          </div>

          {/* Answer input */}
          <div className="border-t border-border pt-4 space-y-3">
            <Textarea
              placeholder="Write your answer..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              rows={3}
              className="resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmitAnswer();
              }}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Ctrl+Enter to send</span>
              <Button
                onClick={handleSubmitAnswer}
                disabled={!newAnswer.trim() || submittingA}
                className="bg-gradient-primary hover:shadow-glow"
                size="sm"
              >
                {submittingA ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Post Answer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
