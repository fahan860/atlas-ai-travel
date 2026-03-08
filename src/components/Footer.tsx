import { Link } from "react-router-dom";
import { Plane } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Plane className="h-5 w-5 text-primary" />
              <span className="font-display text-lg">AtlasTrip AI</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your intelligent travel companion for discovering the magic of Morocco.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Explore</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/flights" className="hover:text-foreground transition-colors">Flights</Link>
              <Link to="/hotels" className="hover:text-foreground transition-colors">Hotels</Link>
              <Link to="/packages" className="hover:text-foreground transition-colors">Packages</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Plan</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/chat" className="hover:text-foreground transition-colors">AI Assistant</Link>
              <Link to="/planner" className="hover:text-foreground transition-colors">Trip Planner</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Destinations</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>Marrakech</span>
              <span>Fes</span>
              <span>Chefchaouen</span>
              <span>Sahara Desert</span>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © 2026 AtlasTrip AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
