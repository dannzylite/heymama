import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HealthMetric } from "@/components/ui/health-metric";
import {
  Activity,
  Calendar,
  MapPin,
  Bell,
  Plus,
  TrendingUp
} from "lucide-react";

export function DashboardPreview() {
  return (
    <section id="dashboard" className="py-20 bg-muted/30">
      <div className="container px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Your Personal Health Dashboard
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Monitor your pregnancy health with intuitive tracking, AI-powered insights, 
            and instant access to care when you need it most.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Dashboard mockup */}
          <div className="bg-gradient-card rounded-2xl shadow-medical p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-foreground">Welcome back, Fatima</h3>
                <p className="text-muted-foreground">28 weeks pregnant • Last check: 2 hours ago</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-secondary text-secondary-foreground">
                  <Activity className="h-3 w-3 mr-1" />
                  All Normal
                </Badge>
                <Button size="sm" className="bg-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Log BP
                </Button>
              </div>
            </div>

            {/* Health Metrics Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <HealthMetric
                title="Blood Pressure"
                value="118/76"
                unit="mmHg"
                status="normal"
                timestamp="2 hours ago"
              />
              <HealthMetric
                title="Heart Rate"
                value="82"
                unit="bpm"
                status="normal"
                timestamp="2 hours ago"
              />
              <HealthMetric
                title="Weight"
                value="68.5"
                unit="kg"
                status="normal"
                timestamp="1 day ago"
              />
              <HealthMetric
                title="Next Checkup"
                value="5"
                unit="days"
                status="normal"
                timestamp="Dr. Aduke"
              />
            </div>

            {/* Quick Actions & Insights */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card className="shadow-card bg-gradient-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>Today's Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm">Take prenatal vitamin</span>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-secondary rounded-full" />
                      <span className="text-sm">Evening BP check</span>
                    </div>
                    <Badge className="bg-secondary text-secondary-foreground">Done</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span className="text-sm">Hydration reminder</span>
                    </div>
                    <Badge variant="outline">3 hours</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card className="shadow-card bg-gradient-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>AI Health Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-secondary rounded-full mt-2" />
                      <div>
                        <p className="text-sm font-medium">Excellent Progress</p>
                        <p className="text-xs text-muted-foreground">Your BP readings show consistent normal range over the past week.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                    <div className="flex items-start space-x-2">
                      <Bell className="w-4 h-4 text-accent mt-1" />
                      <div>
                        <p className="text-sm font-medium">Reminder</p>
                        <p className="text-xs text-muted-foreground">Schedule your 30-week checkup with Dr. Aduke</p>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    <MapPin className="h-4 w-4 mr-2" />
                    Find Nearest Clinic
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}