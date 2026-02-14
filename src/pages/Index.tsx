import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X, Home as HomeIcon, Building2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import ListingCard from "@/components/ListingCard";
import ListingSkeleton from "@/components/ListingSkeleton";
import { mockListings } from "@/lib/mock-data";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const cities = ["All", "Austin", "Portland", "Miami", "Denver", "San Francisco", "Charlotte"];

export default function Index() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All");
  const [listingType, setListingType] = useState<"all" | "rent" | "sale">("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading] = useState(false);

  const filtered = useMemo(() => {
    return mockListings.filter((l) => {
      if (search && !l.title.toLowerCase().includes(search.toLowerCase()) && !l.city.toLowerCase().includes(search.toLowerCase())) return false;
      if (city !== "All" && l.city !== city) return false;
      if (listingType !== "all" && l.listingType !== listingType) return false;
      return true;
    });
  }, [search, city, listingType]);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: "520px" }}>
        <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl"
          >
            Find Your Perfect Home
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4 text-lg text-primary-foreground/80"
          >
            AI-powered screening, instant credit checks, and a smart assistant for every listing.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex items-center overflow-hidden rounded-xl bg-card shadow-2xl"
          >
            <div className="flex flex-1 items-center gap-2 px-4">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by city, neighborhood, or address..."
                className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-muted-foreground"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              size="lg"
              className="m-1.5 shrink-0 rounded-lg"
              onClick={() => {}}
            >
              Search
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Filters + Listings */}
      <section className="container mx-auto px-4 py-10">
        {/* Filter bar */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg border border-border p-1">
            <button
              onClick={() => setListingType("all")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${listingType === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              All
            </button>
            <button
              onClick={() => setListingType("rent")}
              className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${listingType === "rent" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Building2 className="h-3 w-3" /> Rent
            </button>
            <button
              onClick={() => setListingType("sale")}
              className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${listingType === "sale" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <HomeIcon className="h-3 w-3" /> Buy
            </button>
          </div>

          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground md:hidden"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
          </button>

          <div className={`flex flex-wrap gap-2 ${filtersOpen ? "flex" : "hidden md:flex"}`}>
            {cities.map((c) => (
              <button
                key={c}
                onClick={() => setCity(c)}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  city === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {c !== "All" && <MapPin className="h-3 w-3" />}
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ListingSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 font-display text-xl font-semibold text-foreground">No listings found</h3>
            <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
            <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setCity("All"); setListingType("all"); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
