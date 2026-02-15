import { Link } from "react-router-dom";
import { mockListings } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Bed, Bath, Maximize, MapPin } from "lucide-react";

export default function SellerListings() {
  const sellerListings = mockListings.filter((l) => l.sellerId === "s1");

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-display text-3xl font-bold text-foreground text-center">
          Your Listings
        </h1>
        <p className="mt-2 text-center text-muted-foreground text-sm">
          Manage and edit your property listings
        </p>

        {sellerListings.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">You haven't created any listings yet.</p>
            <Button asChild className="mt-4">
              <Link to="/create-listing">Create Your First Listing</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sellerListings.map((listing) => (
              <div
                key={listing.id}
                className="overflow-hidden rounded-xl border border-border bg-card card-shadow transition-shadow hover:shadow-lg"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute top-3 left-3 rounded-md bg-card/90 px-2 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                    {listing.listingType === "rent" ? "For Rent" : "For Sale"}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {listing.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {listing.address}, {listing.city}, {listing.state}
                  </div>

                  <p className="mt-2 font-display text-xl font-bold text-primary">
                    {listing.listingType === "rent"
                      ? `$${listing.price.toLocaleString()}/mo`
                      : `$${listing.price.toLocaleString()}`}
                  </p>

                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Bed className="h-3.5 w-3.5" /> {listing.bedrooms} Beds
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-3.5 w-3.5" /> {listing.bathrooms} Baths
                    </span>
                    <span className="flex items-center gap-1">
                      <Maximize className="h-3.5 w-3.5" /> {listing.sqft} sqft
                    </span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" asChild className="flex-1">
                      <Link to={`/listing/${listing.id}?mode=view`}>
                        <Eye className="mr-1 h-4 w-4" /> View
                      </Link>
                    </Button>
                    <Button size="sm" asChild className="flex-1">
                      <Link to={`/listing/${listing.id}?mode=edit`}>
                        <Edit className="mr-1 h-4 w-4" /> Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
