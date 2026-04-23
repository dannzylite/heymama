import { StatsCard } from "@/components/ui/stats-card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Heart, Users, MapPin } from "lucide-react";

export function ImpactSection() {
  const impactStats = [
    {
      title: "Lives at Risk Daily",
      value: "145",
      description: "Nigerian women die from preventable pregnancy complications",
      variant: "critical" as const
    },
    {
      title: "Global Burden",
      value: "20%",
      description: "Nigeria accounts for 20% of all global maternal deaths",
      variant: "warning" as const
    },
    {
      title: "Preeclampsia Deaths",
      value: "25%",
      description: "Of maternal deaths in Nigeria are from preeclampsia/eclampsia",
      variant: "warning" as const
    },
    {
      title: "Rural Care Gap",
      value: "43%",
      description: "Of rural women receive recommended 4+ antenatal visits",
      variant: "warning" as const
    },
    {
      title: "No BP Monitoring",
      value: "60%",
      description: "Nigerian women lack access to personal BP monitors",
      variant: "critical" as const
    },
    {
      title: "Early Detection Impact",
      value: "90%",
      description: "Of preeclampsia deaths could be prevented with early detection",
      variant: "default" as const
    }
  ];

  return (
    <section id="impact" className="py-20 bg-background">
      <div className="container px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            Critical Health Crisis
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            The Data Speaks: Nigeria's Maternal Health Crisis
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every day, dozens of Nigerian women die from pregnancy-related complications 
            that could have been prevented with timely detection and care.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {impactStats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-primary rounded-2xl p-8 md:p-12 text-center shadow-medical">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-background/20 backdrop-blur text-background px-4 py-2 rounded-full">
              <Heart className="h-5 w-5" />
              <span className="font-medium">The Solution is Within Reach</span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-background">
              We Must Act Now—Through Awareness, Innovation, and Improved Access
            </h3>
            
            <p className="text-background/90 text-lg max-w-2xl mx-auto">
              Don't wait for a scare to start caring. Protect mothers by making blood pressure 
              checks a regular habit. Stay informed, stay equipped, and support accessible care.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <div className="flex items-center space-x-2 text-background">
                <TrendingDown className="h-5 w-5" />
                <span className="font-medium">Early Detection Saves Lives</span>
              </div>
              <div className="flex items-center space-x-2 text-background">
                <Users className="h-5 w-5" />
                <span className="font-medium">Community-Centered Care</span>
              </div>
              <div className="flex items-center space-x-2 text-background">
                <MapPin className="h-5 w-5" />
                <span className="font-medium">Accessible Everywhere</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}