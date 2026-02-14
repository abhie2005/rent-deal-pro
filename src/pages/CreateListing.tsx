import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Plus, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const amenityOptions = [
  "In-Unit Laundry", "Parking", "Gym", "Pool", "Rooftop Deck", "Concierge",
  "Smart Home", "Hardwood Floors", "Fireplace", "Backyard", "Garden",
  "Walk-In Closets", "Solar Panels", "Bike Storage", "Near Transit",
];

const steps = ["Property Info", "Photos & Amenities", "Screening Criteria"];

export default function CreateListing() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // Step 1
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [listingType, setListingType] = useState<"rent" | "sale">("rent");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [sqft, setSqft] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // Step 2
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);

  // Step 3
  const [minCredit, setMinCredit] = useState("600");
  const [minIncome, setMinIncome] = useState("40000");
  const [noEvictions, setNoEvictions] = useState(true);
  const [noBankruptcy, setNoBankruptcy] = useState(true);
  const [noCriminalRecord, setNoCriminalRecord] = useState(true);

  const addImage = () => {
    if (newUrl.trim()) {
      setImageUrls((p) => [...p, newUrl.trim()]);
      setNewUrl("");
    }
  };

  const toggleAmenity = (a: string) => {
    setAmenities((p) => (p.includes(a) ? p.filter((x) => x !== a) : [...p, a]));
  };

  const handleSubmit = () => {
    toast.success("Listing created successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto max-w-2xl px-4 py-10">
        <h1 className="font-display text-3xl font-bold text-foreground">Create New Listing</h1>

        {/* Step indicator */}
        <div className="mt-6 flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              <span className={`hidden text-xs font-medium sm:block ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
              {i < steps.length - 1 && <div className="h-px w-8 bg-border" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mt-8 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setListingType("rent")} className={`rounded-xl border-2 p-3 text-sm font-medium transition-colors ${listingType === "rent" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"}`}>For Rent</button>
                <button type="button" onClick={() => setListingType("sale")} className={`rounded-xl border-2 p-3 text-sm font-medium transition-colors ${listingType === "sale" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"}`}>For Sale</button>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring" placeholder="Modern Downtown Loft" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring resize-none" placeholder="Describe your property..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Price {listingType === "rent" ? "($/mo)" : "($)"}</label>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Sq Ft</label>
                  <input type="number" value={sqft} onChange={(e) => setSqft(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Bedrooms</label>
                  <input type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Bathrooms</label>
                  <input type="number" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Address</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="123 Main St" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">City</label>
                  <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">State</label>
                  <input value={state} onChange={(e) => setState(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="CA" />
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mt-8 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Photos</label>
                <div className="flex gap-2">
                  <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="Paste image URL" className="flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  <Button type="button" variant="outline" onClick={addImage}><Plus className="h-4 w-4" /></Button>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-lg">
                      <img src={url} alt="" className="aspect-[4/3] w-full object-cover" />
                      <button onClick={() => setImageUrls((p) => p.filter((_, j) => j !== i))} className="absolute top-1 right-1 rounded-full bg-foreground/70 p-1 text-background opacity-0 transition-opacity group-hover:opacity-100">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {imageUrls.length === 0 && (
                    <div className="col-span-3 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-10 text-muted-foreground">
                      <ImagePlus className="h-8 w-8" />
                      <p className="mt-2 text-xs">Add photos via URL</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {amenityOptions.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleAmenity(a)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        amenities.includes(a)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mt-8 space-y-4">
              <p className="text-sm text-muted-foreground">Set minimum requirements for applicant screening.</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Min Credit Score</label>
                  <input type="number" value={minCredit} onChange={(e) => setMinCredit(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Min Annual Income ($)</label>
                  <input type="number" value={minIncome} onChange={(e) => setMinIncome(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={noEvictions} onChange={(e) => setNoEvictions(e.target.checked)} className="h-4 w-4 rounded border-input accent-primary" />
                  <span className="text-sm text-foreground">No prior evictions</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={noBankruptcy} onChange={(e) => setNoBankruptcy(e.target.checked)} className="h-4 w-4 rounded border-input accent-primary" />
                  <span className="text-sm text-foreground">No bankruptcy history</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={noCriminalRecord} onChange={(e) => setNoCriminalRecord(e.target.checked)} className="h-4 w-4 rounded border-input accent-primary" />
                  <span className="text-sm text-foreground">No criminal record</span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)}>
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>Create Listing</Button>
          )}
        </div>
      </div>
    </div>
  );
}
