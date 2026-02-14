

# Smart Search with Abbreviations and Partial Matching

## What Changes

The search bar on the home page will be updated so users can type partial city names (e.g., "por" for Portland), common abbreviations (e.g., "SF" for San Francisco), and have everything matched case-insensitively. A suggestions dropdown will appear as the user types.

## Changes

**1. New file: `src/lib/city-aliases.ts`**
A dictionary mapping common abbreviations and shorthand to canonical city names:
- "sf", "san fran" -> San Francisco
- "pdx" -> Portland
- "mia" -> Miami
- "atx" -> Austin
- "den" -> Denver
- "clt" -> Charlotte

Also includes a helper function that takes a search string and returns any matching city names (via alias match or partial name match).

**2. Modified file: `src/pages/Index.tsx`**
- Import the alias helper
- Update the `filtered` logic so the search term is checked against:
  - City aliases (e.g., "sf" matches San Francisco listings)
  - Partial city names (e.g., "por" matches Portland)
  - Address and state fields (not just title and city)
  - All comparisons fully case-insensitive
- Add a suggestions dropdown below the search input that shows:
  - Matching cities (with MapPin icon) -- clicking sets the city filter
  - Matching listings (with Home icon) -- clicking navigates to that listing
- Dropdown appears when the input is focused and has text, closes on blur or selection or Escape key

## Technical Details

### Filtering logic update (in `filtered` useMemo)
```
For each listing, check if the lowercased search term:
1. Matches any city alias -> resolve to canonical city name, compare to listing.city
2. Is a substring of listing.city, listing.title, listing.address, or listing.state
If any match, include the listing.
```

### Suggestions (new `useMemo`)
- Deduplicate matching cities from the alias map and from listings
- Show up to 3 city suggestions and up to 4 listing suggestions
- Render in a positioned dropdown below the search bar with consistent card styling

