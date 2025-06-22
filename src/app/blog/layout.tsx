import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BookOpen, Home } from "lucide-react";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Navigation */}
      <nav className="guardian-nav sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3 group">
                <Image src="/logo.png" alt="GuardianOS Logo" width={40} height={40} />
                <span className="guardian-heading-4 group-hover:text-guardian-blue transition-colors">GuardianOS</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/">
                <button className="guardian-button-secondary group flex items-center">
                  <Home className="w-4 h-4 mr-2 transition-transform group-hover:rotate-12" />
                  Home
                </button>
              </Link>
              <Link href="/guide">
                <button className="guardian-button-secondary group flex items-center">
                  <BookOpen className="w-4 h-4 mr-2 transition-transform group-hover:rotate-12" />
                  Guide
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-12 bg-slate-50 dark:bg-slate-950 mt-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <Image src="/logo.png" alt="GuardianOS Logo" width={32} height={32} />
              <span className="guardian-heading-4">GuardianOS</span>
            </div>
            
            <p className="guardian-body text-muted-foreground text-center md:text-right">
              © 2025 GuardianOS. Building the future of <span className="guardian-emphasis">institutional blockchain compliance</span>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
