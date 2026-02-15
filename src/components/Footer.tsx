import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-primary/20 bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
            <Home className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-sm font-semibold text-foreground">TrustKey</span>
        </div>

        <nav className="flex items-center gap-6">
          <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            About Us
          </Link>
        </nav>

        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} TrustKey. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
