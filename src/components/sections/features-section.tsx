import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  AlertCircle, 
  MapPin, 
  GraduationCap, 
  Users, 
  MessageSquare,
  Mic,
  Languages,
  NotebookPen
} from "lucide-react";

export function FeaturesSection() {
  const coreFeatures = [
    {
      icon: Activity,
      title: "Daily BP Tracking & Risk Flagging",
      description: "Monitor blood pressure manually or with digital cuff. AI-powered risk assessment alerts you to dangerous changes.",
      status: "Core"
    },
    {
      icon: AlertCircle,
      title: "Automated Health Worker Alerts",
      description: "Instant notifications to healthcare providers and family members when readings indicate potential complications.",
      status: "Core"
    },
    {
      icon: MapPin,
      title: "Nearby Clinic Locator",
      description: "Find the closest maternal care facilities using GPS or community health center databases.",
      status: "Core"
    },
    {
      icon: GraduationCap,
      title: "Local Language Education",
      description: "Learn about pregnancy health, preeclampsia warning signs, and care practices in your native language.",
      status: "Core"
    }
  ];

  const additionalFeatures = [
    {
      icon: Mic,
      title: "Voice Input",
      description: "Record symptoms and health data using voice commands for easier access."
    },
    {
      icon: Languages,
      title: "Multi-Language Support",
      description: "Available in Hausa, Yoruba, Igbo, and English for better accessibility."
    },
    {
      icon: MessageSquare,
      title: "AI Health Chatbot",
      description: "Get instant answers to pregnancy questions and health concerns 24/7."
    },
    {
      icon: NotebookPen,
      title: "Health Journaling",
      description: "Track symptoms, emotions, and pregnancy journey with personal notes."
    }
  ];

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Life-Saving Features for Maternal Health
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Early detection, real-time support, and accessible care - everything you need 
            to monitor pregnancy health and prevent complications.
          </p>
        </div>

        {/* Core Features */}
        <div className="space-y-12">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Core Features</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreFeatures.map((feature, index) => (
                <Card key={index} className="shadow-card bg-gradient-card border-primary/20 hover:shadow-medical transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <feature.icon className="h-8 w-8 text-primary" />
                      <Badge variant="secondary">{feature.status}</Badge>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Additional Features */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Enhanced Accessibility</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {additionalFeatures.map((feature, index) => (
                <Card key={index} className="shadow-card bg-gradient-card hover:shadow-medical transition-shadow">
                  <CardHeader className="pb-4">
                    <feature.icon className="h-8 w-8 text-accent mb-2" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}