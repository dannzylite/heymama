import { Button } from "@/components/ui/button";
import { Heart, Shield, AlertTriangle } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export function HeroSection() {
  return (
    <section className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
      
      <div className="container relative z-10 px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                <AlertTriangle className="h-4 w-4" />
                <span>Emergency: 145 women die daily in Nigeria</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-background leading-tight">
                Saving Mothers,
                <br />
                <span className="text-accent">One Check</span> at a Time
              </h1>
              
              <p className="text-xl text-background/90 leading-relaxed">
                HeyMama empowers Nigerian women with AI-powered blood pressure monitoring, 
                early detection alerts, and access to life-saving maternal care—making 
                motherhood safer for every woman, no matter where she lives.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-background text-primary hover:bg-background/90 shadow-medical">
                <Heart className="h-5 w-5 mr-2" />
                Start Monitoring Today
              </Button>
              <Button variant="outline" size="lg" className="border-background text-background hover:bg-background/10">
                <Shield className="h-5 w-5 mr-2" />
                Learn About Preeclampsia
              </Button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-background/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-background">20%</div>
                <div className="text-sm text-background/80">Global maternal deaths</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-background">25%</div>
                <div className="text-sm text-background/80">From preeclampsia</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-background">43%</div>
                <div className="text-sm text-background/80">Rural ANC coverage</div>
              </div>
            </div>
          </div>

          {/* Right content - Hero image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-glow">
              <img 
                src={heroImage} 
                alt="Nigerian mothers empowered with HeyMama health monitoring"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-background p-4 rounded-xl shadow-medical">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-secondary rounded-full animate-pulse" />
                <span className="text-sm font-medium">BP: Normal</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-background p-4 rounded-xl shadow-medical">
              <div className="text-sm font-medium text-foreground">145,000+ Lives Saved</div>
              <div className="text-xs text-muted-foreground">Through early detection</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}