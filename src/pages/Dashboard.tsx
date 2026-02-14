import { useState } from "react";
import { mockListings, mockApplications } from "@/lib/mock-data";
import ScreeningBadge from "@/components/ScreeningBadge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Users, TrendingUp, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import type { Application } from "@/lib/api";

export default function Dashboard() {
  const [selectedListing, setSelectedListing] = useState(mockListings[0]?.id || "");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>(mockApplications);

  const sellerListings = mockListings.filter((l) => l.sellerId === "s1");
  const filteredApps = applications.filter((a) => a.listingId === selectedListing);

  const avgScore = filteredApps.length
    ? Math.round(filteredApps.reduce((s, a) => s + a.matchScore, 0) / filteredApps.length)
    : 0;

  const updateStatus = (id: string, status: "approved" | "rejected") => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    toast.success(`Application ${status}`);
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-display text-3xl font-bold text-foreground">Seller Dashboard</h1>

        {/* Listing selector */}
        <div className="mt-6 flex flex-wrap gap-2">
          {sellerListings.map((l) => (
            <button
              key={l.id}
              onClick={() => setSelectedListing(l.id)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                selectedListing === l.id
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.title}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 card-shadow">
            <div className="flex items-center gap-2 text-muted-foreground"><Users className="h-4 w-4" /> Applicants</div>
            <p className="mt-1 font-display text-2xl font-bold text-foreground">{filteredApps.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 card-shadow">
            <div className="flex items-center gap-2 text-muted-foreground"><TrendingUp className="h-4 w-4" /> Avg Score</div>
            <p className="mt-1 font-display text-2xl font-bold text-foreground">{avgScore}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 card-shadow">
            <div className="flex items-center gap-2 text-muted-foreground"><CheckCircle2 className="h-4 w-4" /> Approved</div>
            <p className="mt-1 font-display text-2xl font-bold text-foreground">{filteredApps.filter((a) => a.status === "approved").length}</p>
          </div>
        </div>

        {/* Applicants */}
        <div className="mt-8 space-y-3">
          {filteredApps.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Users className="mx-auto h-10 w-10 text-muted-foreground/40" />
              <p className="mt-3 text-sm">No applicants yet for this listing.</p>
            </div>
          ) : (
            filteredApps.map((app) => (
              <div key={app.id} className="overflow-hidden rounded-xl border border-border bg-card card-shadow">
                <button
                  onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-4">
                    <ScreeningBadge score={app.matchScore} size="sm" />
                    <div>
                      <p className="font-medium text-foreground">{app.applicantName}</p>
                      <p className="text-xs text-muted-foreground">{app.applicantEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      app.status === "approved" ? "bg-screening-green-bg text-screening-green" :
                      app.status === "rejected" ? "bg-screening-red-bg text-screening-red" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {app.status}
                    </span>
                    {expanded === app.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </button>

                <AnimatePresence>
                  {expanded === app.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border px-4 pb-4 pt-3">
                        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Credit Score</p>
                            <p className="font-semibold text-foreground">{app.creditScore}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Annual Income</p>
                            <p className="font-semibold text-foreground">${app.income.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Evictions</p>
                            <p className="font-semibold text-foreground">{app.evictions}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Bankruptcy</p>
                            <p className="font-semibold text-foreground">{app.bankruptcy ? "Yes" : "No"}</p>
                          </div>
                        </div>

                        {app.status === "pending" && (
                          <div className="mt-4 flex gap-2">
                            <Button size="sm" onClick={() => updateStatus(app.id, "approved")}>
                              <CheckCircle2 className="mr-1 h-4 w-4" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => updateStatus(app.id, "rejected")}>
                              <XCircle className="mr-1 h-4 w-4" /> Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
