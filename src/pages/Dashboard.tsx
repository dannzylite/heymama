import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HealthMetric } from "@/components/ui/health-metric";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/sections/footer";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { Vital, Task } from "@/lib/supabase";
import {
  Activity,
  Calendar,
  MapPin,
  Plus,
  TrendingUp,
  AlertTriangle,
  Heart,
  Phone,
  Timer,
  Pill,
  CalendarIcon,
  Clock,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [logVitalsOpen, setLogVitalsOpen] = useState(false);
  const [savingVitals, setSavingVitals] = useState(false);

  // Displayed metrics — updated from latest saved vital
  const [displayedVitals, setDisplayedVitals] = useState({
    bp: "—",
    heartRate: "—",
    weight: "—",
    timestamp: "No data yet",
  });

  // Vitals form state
  const [weight, setWeight] = useState(68);
  const [bpSystolic, setBpSystolic] = useState("");
  const [bpDiastolic, setBpDiastolic] = useState("");
  const [heartRate, setHeartRate] = useState(75);
  const today = new Date();
  const vitalDate = today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const vitalTime = today.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  // Tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("");
  const [addingTask, setAddingTask] = useState(false);
  const [savingTask, setSavingTask] = useState(false);

  const aiInsights = [
    {
      type: "positive",
      title: "Excellent Progress",
      message: "Your BP readings show consistent normal range over the past week.",
      icon: Heart,
    },
    {
      type: "reminder",
      title: "Upcoming Appointment",
      message: "Dr. Aduke appointment in 3 days — don't forget to bring your BP log!",
      icon: Calendar,
    },
    {
      type: "alert",
      title: "Hydration Reminder",
      message: "You've only logged 4 glasses of water today. Try to reach your goal!",
      icon: Activity,
    },
  ];

  // Load latest vital on mount
  useEffect(() => {
    if (!user) return;
    supabase
      .from("vitals")
      .select("*")
      .eq("user_id", user.id)
      .order("recorded_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }: { data: Vital | null }) => {
        if (data) {
          const ts = new Date(data.recorded_at).toLocaleString("en-US", {
            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
          });
          setDisplayedVitals({
            bp: data.bp_systolic && data.bp_diastolic
              ? `${data.bp_systolic}/${data.bp_diastolic}`
              : "—",
            heartRate: data.heart_rate ? String(data.heart_rate) : "—",
            weight: data.weight ? String(data.weight) : "—",
            timestamp: ts,
          });
          if (data.weight) setWeight(data.weight);
          if (data.heart_rate) setHeartRate(data.heart_rate);
        }
      });
  }, [user]);

  // Load tasks on mount
  useEffect(() => {
    if (!user) return;
    supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .then(({ data }: { data: Task[] | null }) => {
        if (data) setTasks(data);
        setLoadingTasks(false);
      });
  }, [user]);

  const handleSaveVitals = async () => {
    if (!user) return;
    setSavingVitals(true);

    const { error } = await supabase.from("vitals").insert({
      user_id: user.id,
      weight,
      bp_systolic: bpSystolic ? parseInt(bpSystolic) : null,
      bp_diastolic: bpDiastolic ? parseInt(bpDiastolic) : null,
      heart_rate: heartRate,
    });

    if (error) {
      toast({ title: "Error saving vitals", description: error.message, variant: "destructive" });
    } else {
      const now = new Date();
      const ts = now.toLocaleString("en-US", {
        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
      });
      setDisplayedVitals({
        bp: bpSystolic && bpDiastolic ? `${bpSystolic}/${bpDiastolic}` : displayedVitals.bp,
        heartRate: String(heartRate),
        weight: weight.toFixed(1),
        timestamp: ts,
      });
      toast({
        title: "Vitals Saved",
        description: `Weight: ${weight.toFixed(1)} kg • HR: ${heartRate} bpm${bpSystolic && bpDiastolic ? ` • BP: ${bpSystolic}/${bpDiastolic} mmHg` : ""}`,
      });
      setBpSystolic("");
      setBpDiastolic("");
      setLogVitalsOpen(false);
    }
    setSavingVitals(false);
  };

  const toggleTask = async (task: Task) => {
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !task.completed })
      .eq("id", task.id);

    if (!error) {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
      );
    }
  };

  const handleAddTask = async () => {
    if (!newTaskName.trim() || !user) {
      toast({ title: "Task name required", variant: "destructive" });
      return;
    }
    setSavingTask(true);

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        user_id: user.id,
        task_name: newTaskName.trim(),
        task_time: newTaskTime.trim() || "Any time",
        completed: false,
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Error adding task", description: error.message, variant: "destructive" });
    } else if (data) {
      setTasks((prev) => [...prev, data as Task]);
      setNewTaskName("");
      setNewTaskTime("");
      setAddingTask(false);
      toast({ title: "Task Added", description: `"${(data as Task).task_name}" added to today's tasks.` });
    }
    setSavingTask(false);
  };

  const userName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Log Vitals Modal */}
      <Dialog open={logVitalsOpen} onOpenChange={setLogVitalsOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">Log Vitals</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-2">
            {/* Weight */}
            <div>
              <h3 className="text-lg font-bold mb-3">Weight</h3>
              <div className="relative">
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  placeholder="Weight (kg)"
                  className="pr-12 text-base h-14 rounded-xl bg-muted/40 border-muted"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">kg</span>
              </div>
              <div className="mt-3 px-1">
                <Slider
                  min={30}
                  max={150}
                  step={0.5}
                  value={[weight]}
                  onValueChange={([val]) => setWeight(val)}
                  className="[&_[role=slider]]:bg-blue-500 [&_[role=slider]]:border-blue-500"
                />
                <p className="text-sm text-muted-foreground mt-1">{weight.toFixed(1)} kg</p>
              </div>
            </div>

            {/* Blood Pressure */}
            <div>
              <h3 className="text-lg font-bold mb-1">
                Blood Pressure <span className="text-sm font-normal text-muted-foreground">(Optional)</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Input
                    type="number"
                    value={bpSystolic}
                    onChange={(e) => setBpSystolic(e.target.value)}
                    placeholder="Systolic"
                    className="pr-14 h-14 rounded-xl bg-muted/40 border-muted text-base"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">mmHg</span>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    value={bpDiastolic}
                    onChange={(e) => setBpDiastolic(e.target.value)}
                    placeholder="Diastolic"
                    className="pr-14 h-14 rounded-xl bg-muted/40 border-muted text-base"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">mmHg</span>
                </div>
              </div>
            </div>

            {/* Heart Rate */}
            <div>
              <h3 className="text-lg font-bold mb-1">
                Heart Rate <span className="text-sm font-normal text-muted-foreground">(Optional)</span>
              </h3>
              <div className="relative">
                <Input
                  type="number"
                  value={heartRate}
                  onChange={(e) => setHeartRate(Number(e.target.value))}
                  placeholder="Heart Rate (bpm)"
                  className="pr-12 h-14 rounded-xl bg-muted/40 border-muted text-base"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">bpm</span>
              </div>
              <div className="mt-3 px-1">
                <Slider
                  min={40}
                  max={200}
                  step={1}
                  value={[heartRate]}
                  onValueChange={([val]) => setHeartRate(val)}
                  className="[&_[role=slider]]:bg-blue-500 [&_[role=slider]]:border-blue-500"
                />
                <p className="text-sm text-muted-foreground mt-1">{heartRate} bpm</p>
              </div>
            </div>

            {/* Date & Time */}
            <div>
              <h3 className="text-lg font-bold mb-3">Date & Time</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 h-14 px-4 rounded-xl bg-muted/40 border border-muted">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground shrink-0" />
                  <span className="text-sm">{vitalDate}</span>
                </div>
                <div className="flex items-center gap-2 h-14 px-4 rounded-xl bg-muted/40 border border-muted">
                  <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
                  <span className="text-sm">{vitalTime}</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSaveVitals}
              disabled={savingVitals}
              className="w-full h-14 rounded-2xl text-base font-semibold bg-blue-500 hover:bg-blue-600 text-white"
            >
              {savingVitals ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Vitals"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="container px-4 py-8 animate-fade-in">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {userName} 👋
            </h1>
            <p className="text-muted-foreground">Next appointment in 3 days</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Badge className="bg-secondary text-secondary-foreground animate-scale-in">
              <Activity className="h-3 w-3 mr-1" />
              All Systems Normal
            </Badge>
            <Button className="bg-gradient-primary shadow-medical hover:shadow-glow transition-all">
              <Phone className="h-4 w-4 mr-2" />
              Emergency
            </Button>
          </div>
        </div>

        {/* Health Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <HealthMetric
            title="Blood Pressure"
            value={displayedVitals.bp}
            unit="mmHg"
            status="normal"
            timestamp={displayedVitals.timestamp}
            className="animate-fade-in hover:shadow-medical transition-shadow cursor-pointer"
          />
          <HealthMetric
            title="Heart Rate"
            value={displayedVitals.heartRate}
            unit="bpm"
            status="normal"
            timestamp={displayedVitals.timestamp}
            className="animate-fade-in hover:shadow-medical transition-shadow cursor-pointer"
          />
          <HealthMetric
            title="Weight"
            value={displayedVitals.weight}
            unit="kg"
            status="normal"
            timestamp={displayedVitals.timestamp}
            className="animate-fade-in hover:shadow-medical transition-shadow cursor-pointer"
          />
        </div>

        {/* Log Vitals Button */}
        <div className="mb-8">
          <Button
            onClick={() => setLogVitalsOpen(true)}
            className="bg-gradient-primary shadow-medical hover:shadow-glow transition-all"
          >
            <Activity className="h-4 w-4 mr-2" />
            Log Vitals
          </Button>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Tasks */}
          <Card className="shadow-card bg-gradient-card animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Today's Health Tasks</span>
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAddingTask(true)}
                  className="hover:shadow-medical transition-shadow"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Task
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingTasks ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : tasks.length === 0 && !addingTask ? (
                <p className="text-sm text-muted-foreground text-center py-4">No tasks yet. Add your first task!</p>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleTask(task)}
                        className={`w-4 h-4 rounded-full border-2 transition-all ${
                          task.completed
                            ? "bg-secondary border-secondary"
                            : "border-muted-foreground hover:border-primary"
                        }`}
                      />
                      <div>
                        <p className={`text-sm ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {task.task_name}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Timer className="h-3 w-3 mr-1" />
                          {task.task_time}
                        </p>
                      </div>
                    </div>
                    {task.task_name.toLowerCase().includes("vitamin") || task.task_name.toLowerCase().includes("medication") ? (
                      <Pill className="h-4 w-4 text-accent" />
                    ) : (
                      <Activity className="h-4 w-4 text-primary" />
                    )}
                  </div>
                ))
              )}

              {addingTask && (
                <div className="p-3 bg-muted/50 rounded-lg space-y-2 border border-primary/20">
                  <Input
                    placeholder="Task name"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    className="text-sm"
                    autoFocus
                  />
                  <Input
                    placeholder="Time (e.g. 9:00 AM)"
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    className="text-sm"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddTask} disabled={savingTask} className="bg-gradient-primary">
                      {savingTask ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setAddingTask(false); setNewTaskName(""); setNewTaskTime(""); }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="shadow-card bg-gradient-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>AI Health Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiInsights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border transition-all hover:shadow-md ${
                    insight.type === "positive" ? "bg-secondary/10 border-secondary/20" :
                    insight.type === "alert" ? "bg-warning/10 border-warning/20" :
                    "bg-accent/10 border-accent/20"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <insight.icon className={`w-4 h-4 mt-1 ${
                      insight.type === "positive" ? "text-secondary" :
                      insight.type === "alert" ? "text-warning" :
                      "text-accent"
                    }`} />
                    <div>
                      <p className="text-sm font-medium">{insight.title}</p>
                      <p className="text-xs text-muted-foreground">{insight.message}</p>
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" size="sm" className="w-full hover:shadow-medical transition-shadow" onClick={() => navigate("/clinics")}>
                <MapPin className="h-4 w-4 mr-2" />
                Find Nearest Clinic
              </Button>
            </CardContent>
          </Card>

          {/* Emergency Resources */}
          <Card className="shadow-card bg-gradient-to-br from-destructive/5 to-warning/5 border-destructive/20 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span>Emergency Resources</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-destructive/10 rounded-lg">
                <h4 className="font-bold text-destructive mb-2">Warning Signs</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Severe headache</li>
                  <li>• Vision changes</li>
                  <li>• Upper abdominal pain</li>
                  <li>• Rapid weight gain</li>
                  <li>• Decreased baby movement</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Button className="w-full bg-destructive hover:bg-destructive/90 animate-pulse-glow">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Emergency: 199
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate("/clinics")}>
                  <MapPin className="h-4 w-4 mr-2" />
                  Nearest Hospital
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
