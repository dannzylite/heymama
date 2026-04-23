import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import {
  BookOpen,
  Play,
  Clock,
  AlertTriangle,
  Heart,
  Baby,
  Stethoscope,
  Pill,
  MessageSquare,
  Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/layout/navigation";
import { CommunityQA } from "@/components/education/CommunityQA";

export default function Education() {
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [completedModules, setCompletedModules] = useState<number[]>([1, 3]);
  const [showComingSoon, setShowComingSoon] = useState(false);

  // Demo education data
  const educationModules = [
    {
      id: 1,
      title: "Understanding Preeclampsia",
      description: "Learn about the warning signs, risk factors, and prevention of preeclampsia",
      duration: "15 min",
      difficulty: "Beginner",
      category: "Health Conditions",
      completed: true,
      progress: 100,
      icon: AlertTriangle,
      lessons: 5,
      downloadable: true
    },
    {
      id: 2,
      title: "Blood Pressure Monitoring",
      description: "How to properly measure and track your blood pressure during pregnancy",
      duration: "12 min",
      difficulty: "Beginner", 
      category: "Self-Care",
      completed: false,
      progress: 40,
      icon: Heart,
      lessons: 4,
      downloadable: true
    },
    {
      id: 3,
      title: "Healthy Pregnancy Nutrition",
      description: "Essential nutrients and foods for a healthy pregnancy in Nigerian context",
      duration: "20 min",
      difficulty: "Beginner",
      category: "Nutrition",
      completed: true,
      progress: 100,
      icon: Baby,
      lessons: 6,
      downloadable: false
    },
    {
      id: 4,
      title: "Emergency Warning Signs",
      description: "Critical symptoms that require immediate medical attention",
      duration: "8 min", 
      difficulty: "Essential",
      category: "Emergency",
      completed: false,
      progress: 0,
      icon: Stethoscope,
      lessons: 3,
      downloadable: true
    },
    {
      id: 5,
      title: "Medication Safety",
      description: "Safe use of medications during pregnancy and breastfeeding",
      duration: "18 min",
      difficulty: "Intermediate",
      category: "Medication",
      completed: false,
      progress: 60,
      icon: Pill,
      lessons: 7,
      downloadable: true
    }
  ];

  const languages = [
    { code: "english", name: "English", flag: "🇬🇧" },
    { code: "yoruba", name: "Yorùbá", flag: "🇳🇬" },
    { code: "igbo", name: "Igbo", flag: "🇳🇬" },
    { code: "hausa", name: "Hausa", flag: "🇳🇬" }
  ];

  const categories = [
    { key: "all", label: "All Topics", count: 5 },
    { key: "emergency", label: "Emergency", count: 1 },
    { key: "health", label: "Health Conditions", count: 1 },
    { key: "selfcare", label: "Self-Care", count: 1 },
    { key: "nutrition", label: "Nutrition", count: 1 },
    { key: "medication", label: "Medication", count: 1 }
  ];

  const handleStartModule = (moduleId: number, title: string) => {
    setShowComingSoon(true);
  };

  const handleDownload = (title: string) => {
    toast({
      title: "Download Started",
      description: `Downloading "${title}" for offline access...`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl">Coming Soon</DialogTitle>
            <DialogDescription className="text-base pt-2">
              This module is not available yet. We're working hard to bring you high-quality health education content. Check back soon!
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowComingSoon(false)} className="mt-2 bg-gradient-primary">
            Got it
          </Button>
        </DialogContent>
      </Dialog>

      <div className="container px-4 py-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Health Education</h1>
            <p className="text-muted-foreground">Learn about pregnancy health in your preferred language</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
            <Button variant="outline" className="hover:shadow-medical transition-shadow">
              <Download className="h-4 w-4 mr-2" />
              Offline Mode
            </Button>
          </div>
        </div>

        <Tabs defaultValue="modules" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="modules" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Learning Modules</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Community Q&A</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>My Progress</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="modules">
            {/* Learning Progress */}
            <Card className="mb-8 shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-primary" />
                  <span>Your Learning Journey</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">2/5</div>
                    <p className="text-sm text-muted-foreground">Modules Completed</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">48 min</div>
                    <p className="text-sm text-muted-foreground">Time Learned</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">85%</div>
                    <p className="text-sm text-muted-foreground">Knowledge Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Modules Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {educationModules.map((module) => (
                <Card key={module.id} className="shadow-card bg-gradient-card hover:shadow-medical transition-all animate-scale-in">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <module.icon className={`h-8 w-8 ${
                        module.completed ? 'text-secondary' : 'text-primary'
                      }`} />
                      {module.completed && (
                        <Badge className="bg-secondary text-secondary-foreground">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {module.duration}
                      </span>
                      <span>{module.lessons} lessons</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{module.progress}%</span>
                      </div>
                      <Progress value={module.progress} className="h-2" />
                    </div>

                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">{module.difficulty}</Badge>
                      <Badge variant="outline" className="text-xs">{module.category}</Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleStartModule(module.id, module.title)}
                        className="flex-1 bg-gradient-primary hover:shadow-glow transition-all"
                        size="sm"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        {module.progress > 0 ? 'Continue' : 'Start'}
                      </Button>
                      
                      {module.downloadable && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownload(module.title)}
                          className="hover:shadow-medical transition-shadow"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="community">
            <CommunityQA />
          </TabsContent>

          <TabsContent value="progress">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Achievement Overview */}
              <Card className="shadow-card bg-gradient-card">
                <CardHeader>
                  <CardTitle>Learning Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 bg-secondary/10 rounded-lg">
                    <div className="text-3xl font-bold text-secondary mb-2">2/5</div>
                    <p className="text-muted-foreground">Modules Completed</p>
                    <Progress value={40} className="mt-4" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Essential Safety Knowledge</span>
                      <Badge className="bg-secondary text-secondary-foreground">Earned</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Nutrition Expert</span>
                      <Badge className="bg-secondary text-secondary-foreground">Earned</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Blood Pressure Pro</span>
                      <Badge variant="outline">60% Complete</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Activity */}
              <Card className="shadow-card bg-gradient-card">
                <CardHeader>
                  <CardTitle>This Week's Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-secondary rounded-full" />
                        <span className="text-sm">Completed Nutrition Module</span>
                      </div>
                      <span className="text-xs text-muted-foreground">2 days ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-sm">Asked community question</span>
                      </div>
                      <span className="text-xs text-muted-foreground">4 days ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-accent rounded-full" />
                        <span className="text-sm">Downloaded offline content</span>
                      </div>
                      <span className="text-xs text-muted-foreground">1 week ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}