import { Heart, Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  const team = [
    "Oyewole Ifeoluwa",
    "Mosimi Akinlabi", 
    "Adediji Faith"
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="container px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">HeyMama</span>
            </div>
            <p className="text-background/80">
              Making motherhood safer for every woman in Nigeria through early detection, 
              AI-powered health monitoring, and accessible maternal care.
            </p>
          </div>

          {/* Team */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Our Team</h4>
            <div className="space-y-2">
              {team.map((member, index) => (
                <p key={index} className="text-background/80">{member}</p>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Get Involved</h4>
            <div className="space-y-2">
              <p className="text-background/80">Help us save mothers' lives</p>
              <div className="flex space-x-4">
                <Github className="h-5 w-5 text-background/60 hover:text-background cursor-pointer transition-colors" />
                <Twitter className="h-5 w-5 text-background/60 hover:text-background cursor-pointer transition-colors" />
                <Mail className="h-5 w-5 text-background/60 hover:text-background cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center">
          <p className="text-background/60">
            © 2024 HeyMama. Built with ❤️ for Nigerian mothers. 
            <span className="block mt-2 text-sm">
              "Because saving mothers means saving the future of Nigeria."
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}