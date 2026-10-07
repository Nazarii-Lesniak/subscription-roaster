# Subscription Roaster

Next.js App Router mini app for tracking subscriptions, calculating recurring costs, and roasting the monthly total.

## Run

```bash
npm install
npm run dev
```

Open the address printed by Next.js (usually `http://localhost:3000`). Use `npm run build` and `npm start` for a production build and server.

## Architecture

- `app/page.tsx` is a Server Component that renders the client dashboard.
- `app/api/search/route.ts` is a server-side FreeSerp proxy. It validates the query, normalizes provider results, and returns a small JSON array to the browser.
- `components/custom-dropdown.tsx` is the shared, keyboard accessible dropdown used by theme, language, billing period, and category controls.
- `components/translation-provider.tsx` exports `TranslationProvider`, `TranslationContext`, and `useTranslation`. All user facing copy, category labels, and roast lines live in `locales/en.json` and `locales/uk.json`.
- `components/subscription-form.tsx` contains the RHF/Zod form, 500 ms debounced search, and add flow.
- `components/subscription-list.tsx` contains subscription actions and detail/price editing.
- `hooks/use-subscriptions.ts` owns client state, monthly totals, and `localStorage` synchronization.
- `lib/search.ts`, `lib/storage.ts`, and `lib/roast.ts` isolate browser search, persistence/logo URL, and localized roast selection.
- Component styling uses Tailwind CSS v4 utility classes. `app/globals.css` contains only theme tokens and global base behavior.

## Notes

- Subscription records and theme/language preferences remain in the current browser's `localStorage`; there is no account or cross device sync.
- The FreeSerp call now runs from the Next.js server, so browser CORS headers from FreeSerp do not affect search. The route accepts the common `organic`, `results`, or root-array response shapes. Update `normalizeResults` in the route handler if the provider changes its format.
- Clearbit logo URLs use the selected result's host. A failed logo falls back to the Lucide category icon.
- Prices are USD. Yearly prices are divided by twelve for monthly totals and roast bands.
- Each roast band currently has three localized sample lines. Add more to both JSON dictionaries to reach ten examples per band.
- Replace the GitHub and LinkedIn URLs in `components/dashboard.tsx` with your own profiles when ready.
