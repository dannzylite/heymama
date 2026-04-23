import { Heart, Mail } from "lucide-react";

export function Footer() {
  const team = [
    "Ifeloluwa Adeife Oyewole",
    "Okorie Daniel",
    "Onyenakorom Tochukwu Samuel",
    "Atobatele Oluwasegun Isaac",
    "Ngeri Belema Tosin",
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

          {/* Get Involved */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Get Involved</h4>
            <p className="text-background/80">Help us save mothers' lives</p>
            <div className="flex space-x-5">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/heymamacare01?igsh=NXYyMm56b3Y1M2s5&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-background/60 hover:text-background transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              {/* X / Twitter */}
              <a
                href="https://x.com/heymamacare"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter"
                className="text-background/60 hover:text-background transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/heymamacare/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-background/60 hover:text-background transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect width="4" height="12" x="2" y="9"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              {/* Mail */}
              <a
                href="mailto:heymamacare@gmail.com"
                aria-label="Email"
                className="text-background/60 hover:text-background transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center">
          <p className="text-background/60">
            © 2025 HeyMama. Built with ❤️ for Nigerian mothers.
            <span className="block mt-2 text-sm">
              "Because saving mothers means saving the future of Nigeria."
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
