import { Navigation } from "@/components/layout/navigation";
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { ImpactSection } from "@/components/sections/impact-section";
import { DashboardPreview } from "@/components/sections/dashboard-preview";
import { Footer } from "@/components/sections/footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ImpactSection />
        <DashboardPreview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
