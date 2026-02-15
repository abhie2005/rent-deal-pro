import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Home, PlusCircle, LayoutDashboard, LogIn, UserPlus, Menu, X, LogOut, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/create-listing", label: "New Listing", icon: PlusCircle, auth: true, role: "seller" as const },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, auth: true, role: "seller" as const },
  { to: "/seller-listings", label: "My Listings", icon: FileEdit, auth: true, role: "seller" as const },
];

export default function Navbar() {
  const { user, isAuthenticated, logout, switchRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"buyer" | "seller">(
    location.pathname === "/dashboard" ? "seller" : "buyer"
  );

  const visibleLinks = navLinks.filter((l) => {
    if (l.auth && !isAuthenticated) return false;
    if (l.role && user?.role !== l.role) return false;
    if ("hideForRole" in l && l.hideForRole && user?.role === l.hideForRole) return false;
    return true;
  });

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/95 nav-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-xl font-semibold text-foreground hover:text-primary transition-colors" style={{ fontFamily: "'Roboto', sans-serif" }}>
            TrustKey
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {!isAuthenticated && selectedRole === "seller" && (
            <>
              <Link
                to="/create-listing"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === "/create-listing" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <PlusCircle className="h-4 w-4" />
                New Listing
              </Link>
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === "/dashboard" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/seller-listings"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === "/seller-listings" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <FileEdit className="h-4 w-4" />
                My Listings
              </Link>
            </>
          )}
          {visibleLinks.map((l) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <div className="flex items-center rounded-lg border border-border bg-muted/50 p-0.5">
            <button
              onClick={() => {
                setSelectedRole("buyer");
                if (isAuthenticated) switchRole("buyer");
                navigate("/");
              }}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedRole === "buyer"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Buyer
            </button>
            <button
              onClick={() => {
                setSelectedRole("seller");
                if (isAuthenticated) switchRole("seller");
                navigate("/dashboard");
              }}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedRole === "seller"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Seller
            </button>
          </div>
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {user?.name}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="mr-1 h-4 w-4" />
                Log Out
              </Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login"><LogIn className="mr-1 h-4 w-4" />Log In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register"><UserPlus className="mr-1 h-4 w-4" />Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border md:hidden bg-card"
          >
            <div className="flex flex-col gap-1 p-4">
              {visibleLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <l.icon className="h-4 w-4" />
                  {l.label}
                </Link>
              ))}
              <div className="mt-2 border-t border-border pt-2">
                {isAuthenticated ? (
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted">
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted">
                      <LogIn className="h-4 w-4" /> Log In
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted">
                      <UserPlus className="h-4 w-4" /> Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
