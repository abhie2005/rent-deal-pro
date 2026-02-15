import { useState } from "react";
import { mockListings, mockApplications } from "@/lib/mock-data";
import ScreeningBadge from "@/components/ScreeningBadge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Users, TrendingUp, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { toast } from "sonner";
import type { Application } from "@/lib/api";

export default function Dashboard() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>(mockApplications);

  const sellerListings = mockListings.filter((l) => l.sellerId === "s1");
  const filteredApps = applications;

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
        <h1 className="font-display text-3xl font-bold text-foreground text-center">Seller Dashboard</h1>

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
            filteredApps.map((app) => {
              const listing = mockListings.find((l) => l.id === app.listingId);
              const isExpanded = expanded === app.id;
              const dashLen = (app.creditScore / 850) * 264;

              return (
              <div key={app.id} className="overflow-hidden rounded-xl border border-border bg-card card-shadow">
                <button
                  onClick={() => setExpanded(isExpanded ? null : app.id)}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-4">
                    <ScreeningBadge score={app.matchScore} size="sm" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{app.applicantName}</p>
                        {listing && (
                          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                            {listing.title}
                          </span>
                        )}
                      </div>
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
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border px-4 pb-4 pt-3">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                          {/* Animated Circular Credit Score Meter */}
                          <div className="flex flex-col items-center">
                            <div className="relative h-24 w-24">
                              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                                <circle cx="50" cy="50" r="42" fill="none" strokeWidth="8" className="stroke-muted/30" />
                                <motion.circle
                                  cx="50" cy="50" r="42"
                                  fill="none"
                                  strokeWidth="8"
                                  strokeLinecap="round"
                                  className={
                                    app.creditScore >= 700 ? "stroke-screening-green" :
                                    app.creditScore >= 600 ? "stroke-screening-yellow" :
                                    "stroke-screening-red"
                                  }
                                  initial={{ strokeDasharray: "0 264" }}
                                  animate={{ strokeDasharray: `${dashLen} 264` }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="font-display text-lg font-bold text-foreground">{app.creditScore}</span>
                                <span className="text-[10px] text-muted-foreground">/ 850</span>
                              </div>
                            </div>
                            <p className="mt-1 text-xs font-medium text-muted-foreground">Credit Score</p>
                          </div>

                          {/* Other Details */}
                          <div className="grid grid-cols-3 gap-6 text-sm flex-1">
                            <div className="text-center sm:text-left">
                              <p className="text-xs text-muted-foreground">Evictions</p>
                              <p className="font-semibold text-foreground">{app.evictions}</p>
                            </div>
                            <div className="text-center sm:text-left">
                              <p className="text-xs text-muted-foreground">Bankruptcy</p>
                              <p className="font-semibold text-foreground">{app.bankruptcy ? "Yes" : "No"}</p>
                            </div>
                            <div className="text-center sm:text-left">
                              <p className="text-xs text-muted-foreground">Criminal Record</p>
                              <p className="font-semibold text-foreground">None</p>
                            </div>
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
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
