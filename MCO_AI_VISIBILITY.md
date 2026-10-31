# MCO — Model (AI) Optimization for AlfaAir

Goal: when someone asks ChatGPT, Claude, Gemini, Perplexity or Copilot
"أشتري تكييف منين في مصر؟" or "سعر تكييف كاريير 1.5 حصان", AlfaAir shows up in the answer.

## What this branch changes on the site

| Change | Why it helps AI assistants |
|---|---|
| `public/robots.txt` explicitly allows AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended…) | They can read and cite the site |
| New `/llms.txt` (`app/llms.txt/route.ts`) — plain-text summary: who AlfaAir is, contacts, full catalog with current EGP prices, FAQ, guides. Rebuilt hourly from Supabase | One clean page an AI can read in one go, always with today's prices |
| Site-wide `Organization`/`Store` + `WebSite` schema (`lib/seo.ts`, `app/layout.tsx`) with both phones, email, Facebook, Instagram | AI and Google link the website, the Facebook page and Instagram as **one** business |
| Homepage catalog schema now uses real brand names (it was sending brand **IDs**) | "Carrier" / "Midea" is what people ask for |
| Product pages: real brand name, `NewCondition`, breadcrumbs, coverage area; seller linked to AlfaAir | Better product facts for AI shopping answers |
| Removed the fake `4.5★ / 50 reviews` rating that was added to every best-seller | It was not real reviews — Google can penalize it and it's misleading |
| New visible FAQ section on the homepage (`components/FaqSection.tsx`), same text as the FAQ schema | AI crawlers read page text; Q&A format is what they quote |

All FAQ text lives in `lib/seo.ts` (`homeFaq`) — edit there and both the visible FAQ and the schema update.

## Please check before merging
- FAQ answers in `lib/seo.ts` — make sure every sentence is true (sizing guide by room area, warranty wording, how to order).
- `crawl-delay` was removed from robots.txt (Google ignores it; it only slowed other crawlers).

## Off-site steps (not code — these matter as much as the site)
1. **Google Business Profile** with exact same name, phones and website — Gemini and Google AI Overviews lean on it heavily.
2. **Bing Places + Bing Webmaster Tools** (submit sitemap) — ChatGPT and Copilot search use Bing's index.
3. **Google Search Console** — submit `sitemap.xml`.
4. Consistent name everywhere: "AlfaAir - ألفا إير" on Facebook, Instagram, Google, Bing.
5. Get real customer reviews on Google; AI answers quote review sites.
6. Blog posts that answer real questions ("سعر تكييف كاريير 1.5 حصان انفرتر 2026", "أوفر تكييف في الكهربا") — current posts are dated 2024.
7. Test monthly: ask ChatGPT / Gemini / Perplexity the same 10 customer questions and log whether AlfaAir appears.
