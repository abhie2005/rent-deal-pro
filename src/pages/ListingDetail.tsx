import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Bed, Bath, Maximize, MapPin, Calendar, CheckCircle2, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import ScreeningBadge from "@/components/ScreeningBadge";
import { mockListings } from "@/lib/mock-data";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function ListingDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const listing = mockListings.find((l) => l.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyState, setApplyState] = useState<"form" | "loading" | "success">("form");
  const [matchScore] = useState(87);
  const [applyForm, setApplyForm] = useState({ lastName: "", firstName: "", dob: "", email: "" });

  if (!listing) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="text-center">
          <h2 className="font-display text-2xl font-semibold">Listing not found</h2>
          <Button asChild className="mt-4"><Link to="/">Back to Browse</Link></Button>
        </div>
      </div>
    );
  }

  const priceLabel = listing.listingType === "rent"
    ? `$${listing.price.toLocaleString()}/mo`
    : `$${listing.price.toLocaleString()}`;

  const handleApply = () => {
    setApplyState("loading");
    setTimeout(() => setApplyState("success"), 2000);
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="flex items-center gap-1 hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Browse</Link>
          <span>/</span>
          <span className="text-foreground">{listing.title}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: Images + Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="space-y-3">
              <div className="overflow-hidden rounded-xl">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={listing.images[selectedImage]}
                  alt={listing.title}
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>
              {listing.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {listing.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                        i === selectedImage ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt="" className="h-16 w-24 object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl font-bold text-foreground">{listing.title}</h1>
                  <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {listing.address}, {listing.city}, {listing.state}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display text-3xl font-bold text-secondary">{priceLabel}</p>
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    For {listing.listingType === "rent" ? "Rent" : "Sale"}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-6 rounded-xl bg-muted/50 p-4">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-semibold text-foreground">{listing.bedrooms}</p>
                    <p className="text-xs text-muted-foreground">Bedrooms</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-semibold text-foreground">{listing.bathrooms}</p>
                    <p className="text-xs text-muted-foreground">Bathrooms</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-semibold text-foreground">{listing.sqft.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Sq Ft</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-semibold text-foreground">{new Date(listing.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">Listed</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="font-display text-lg font-semibold text-foreground">Description</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">{listing.description}</p>
              </div>

              <div className="mt-6">
                <h2 className="font-display text-lg font-semibold text-foreground">Amenities</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {listing.amenities.map((a) => (
                    <span key={a} className="flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground">
                      <CheckCircle2 className="h-3 w-3 text-screening-green" />
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar: Apply */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6 card-shadow space-y-4">
              <h3 className="font-display text-lg font-semibold text-foreground">Interested?</h3>
              <p className="text-sm text-muted-foreground">Apply now and get instantly screened with our AI-powered credit check.</p>
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  if (!isAuthenticated) {
                    window.location.href = "/login";
                    return;
                  }
                  setApplyOpen(true);
                }}
              >
                <Send className="mr-2 h-4 w-4" />
                Apply Now
              </Button>
              <p className="text-center text-xs text-muted-foreground">Your data is secure and encrypted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Apply for {listing.title}</DialogTitle>
            <DialogDescription>
              By applying, you consent to a soft credit check via CRS Credit API. This won't affect your credit score.
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {applyState === "form" && (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Last Name</label>
                    <input value={applyForm.lastName} onChange={(e) => setApplyForm(f => ({ ...f, lastName: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring" placeholder="Doe" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">First Name</label>
                    <input value={applyForm.firstName} onChange={(e) => setApplyForm(f => ({ ...f, firstName: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring" placeholder="Jane" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Date of Birth</label>
                    <input value={applyForm.dob} onChange={(e) => setApplyForm(f => ({ ...f, dob: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring" placeholder="MM/DD/YY" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                    <input type="email" value={applyForm.email} onChange={(e) => setApplyForm(f => ({ ...f, email: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring" placeholder="you@example.com" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">By applying, you consent to a soft credit check. This won't affect your credit score.</p>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setApplyOpen(false)}>Cancel</Button>
                  <Button className="flex-1" onClick={handleApply} disabled={!applyForm.lastName || !applyForm.firstName || !applyForm.dob || !applyForm.email}>Apply</Button>
                </div>
              </motion.div>
            )}
            {applyState === "loading" && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-8">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-3 text-sm text-muted-foreground">Running your screening...</p>
              </motion.div>
            )}
            {applyState === "success" && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-4 text-center py-4">
                <div className="flex justify-center">
                  <ScreeningBadge score={matchScore} size="lg" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">Application Submitted!</h3>
                <p className="text-sm text-muted-foreground">Your match score is {matchScore}/100. The landlord will review your application and reach out soon.</p>
                <Button className="w-full" onClick={() => { setApplyOpen(false); setApplyState("form"); setApplyForm({ lastName: "", firstName: "", dob: "", email: "" }); }}>Done</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      
    </div>
  );
}
