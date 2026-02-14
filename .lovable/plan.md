

# Smart Search with Abbreviations and Auto-Suggestions

## What Changes

**1. City Abbreviation Map**
Add a lookup dictionary so users can type shorthand like "SF", "PDX", "MIA", "DEN", "ATX", "CLT" (and partial/lowercase versions like "san fran", "sf", "austin") and still match the correct city.

**2. Smarter Search Matching**
Update the filtering logic in `Index.tsx` so the search input:
- Is fully case-insensitive (already partially done)
- Matches city abbreviations (e.g., "SF" matches "San Francisco")
- Matches partial city names (e.g., "por" matches "Portland")
- Also searches against address and state fields

**3. Search Suggestions Dropdown**
Add an auto-suggest dropdown below the search bar that appears as the user types, showing:
- Matching cities with a MapPin icon (e.g., typing "S" shows San Francisco, Charlotte -- wait, no -- shows cities starting with or containing "S")
- Matching listing titles
- Clicking a suggestion fills the search or sets the city filter

## Technical Details

### File: `src/lib/city-aliases.ts` (new)
A simple map of aliases to canonical city names:
```
{
  "sf": "San Francisco",
  "san fran": "San Francisco",
  "pdx": "Portland",
  "mia": "Miami",
  "atx": "Austin",
  "den": "Denver",
  "clt": "Charlotte",
  ...
}
```

### File: `src/pages/Index.tsx` (modified)
- Import the alias map
- Add `searchSuggestions` computed value that returns matching cities and listings based on current input
- Add a dropdown panel below the search input showing suggestions grouped by "Cities" and "Listings"
- Update the `filtered` logic to check search text against city aliases, partial city names, address, and title -- all case-insensitive
- Clicking a city suggestion sets the `city` filter and clears search; clicking a listing suggestion navigates to it
- Dropdown closes on blur or when a suggestion is selected

### Suggestion Dropdown UI
- Appears below the search bar when focused and input has text
- Styled consistently with the card theme (bg-card, shadow, rounded)
- Shows MapPin icon for cities, Home icon for listings
- Highlights matching text portion
- Keyboard-friendly (closes on Escape)

