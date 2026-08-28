# TravelTokyo Product, UX, and Commercial Audit

Audit date: August 28, 2026  
Live product reviewed: https://traveltokyo.workflowlab.site/  
Codebase reviewed read-only: `/Users/maryjoyceablanque/Documents/Side Projects/travel-tokyo/`

## Executive verdict

**Verdict: SELLABLE AFTER MAJOR CHANGES**

TravelTokyo contains the beginnings of a valuable product: a visually distinctive, trip-specific mobile companion that combines a daily plan, weather, transit instructions, bookings, expenses, documents, packing, and emergency information. Its strongest idea is not “a better planner.” It is **a calm, already-prepared trip cockpit that reduces app-switching while someone is traveling**.

It is not ready to sell today. The main blockers are trust and reliability, not missing features:

1. Real passport/visa images and a hotel PDF are deployed as public website files. Blurring them in the interface is not protection.
2. The displayed Japan visitor hotline is not the current official JNTO hotline.
3. Weather data is indexed from “today” and relabeled as the trip’s dates, so forecast days can be wrong.
4. “Today Mode” is not time-aware: it always shows the day’s first event, not the next event.
5. Important data and flows are internally inconsistent: budget totals disagree across pages, planned commitments are excluded from the headline remaining balance, default booking deletion is not persistent, and the site claims offline/PWA behavior without an app-shell caching implementation.

This is currently a strong personal prototype and a weak commercial template. Fixing the five grouped P0 issues at the end would make it a credible paid beta.

## Scorecard

| Dimension | Score | Assessment |
|---|---:|---|
| First Impression | **6.5/10** | Attractive destination branding and clear travel context, but too much content and visible technical language make it feel like a polished developer project rather than a finished consumer product. |
| Visual Design | **6.5/10** | Cohesive navy/pink/cream palette, strong hero, and useful photography. Repeated rounded cards, emojis, tiny labels, generic stock photos, and inconsistent density reduce the premium feel. |
| Mobile UX | **4.5/10** | A bottom dock and responsive stacks exist, but the home page is ~10,600 px tall, the itinerary is ~33,300 px tall, key tap targets are only 32–38 px high, and urgent tools are buried. |
| Trip Utility | **5.5/10** | Broad coverage and genuinely useful content, weakened by incorrect “next” logic, weather/date mapping, unreliable booking defaults, wrong map origins, and incomplete loss/emergency flows. |
| Ease of Use | **5.5/10** | Labels are understandable, but the information architecture is too dense and the traveler must remember where tools live. |
| Customization | **2.5/10** | A large central config exists, but many destination, date, currency, storage, metadata, weather, map, and payment details remain hardcoded. A nondeveloper cannot customize it. |
| Technical Quality | **4/10** | TypeScript checking passes, but lint reports 5 errors and 35 warnings; privacy, API, persistence, offline, and data-correctness problems are material. |
| Sellability Today | **2/10** | Do not sell in its current state because buyers would reasonably expect privacy, accurate signals, durable bookings, and truthful offline claims. |
| Sellability After P0 Fixes | **7.5/10** | A focused paid beta becomes realistic, especially as a personalized setup service. |

## 1. First impression

### What works in the first 5–10 seconds

- The destination, dates, trip length, and traveler count are immediately visible.
- “Tokyo, ready when you are” is consumer-facing and emotionally appropriate.
- The navy/pink/cream palette is recognizable and more ownable than a default monochrome dashboard.
- The hero communicates that this is a comprehensive personal trip companion.

### What weakens the impression

- The opening promise lists itinerary, weather, bookings, expenses, and “every important travel detail,” which explains scope but not the primary on-trip benefit.
- Three hero CTAs compete equally: Today, all seven days, and destination guides.
- The home page immediately becomes a very long collection of cards, guides, forms, and operational panels. It feels assembled rather than edited.
- Phrases such as “Clean Data-Driven Architecture,” “Persisted in IndexedDB,” “Open-Meteo Live,” “Sync Telegram,” and “Personal Travel Control Room” expose implementation language. These make the product feel like a portfolio demo.
- “Actual dining menus” and “real photography” are asserted in product copy; some imagery is generic Unsplash content and should not be positioned as verified current menu information.
- There are 84 remote Unsplash image references. The quantity creates visual richness but also generic-stock inconsistency and weak offline reliability.
- The intended Japanese serif fonts are named in CSS but not loaded, so rendering falls back to local serif fonts and varies by device.

**First Impression score: 6.5/10.** It looks more thoughtful than a generic admin dashboard, but it does not yet feel controlled, trustworthy, or finished enough to command a premium.

## 2. Mobile travel UX

### Navigation and one-handed use

- The fixed bottom dock is the right mobile pattern.
- Its measured controls are approximately 32 px high; a reliable travel UI should use at least 44 px touch targets.
- Only “Itinerary” is visibly labeled; Today, Weather, Budget, Tools, and SOS are icon-first. Hidden text helps some accessibility tooling but not travelers trying to recognize icons quickly.
- The Itinerary item is visually hardcoded as active even on the Today page.
- Tools and SOS scroll to sections around 7,600 px and 8,700 px down the home document. The scroll action is fast, but this architecture remains fragile and loses orientation.

### Today page

- “Open Today Mode” scrolls to a section; it does not open a focused mode.
- The “Up Next” card always uses `sunPlan[0]`. At 6:00 PM it can still show a 3:30 AM airport lounge event.
- Before and after the trip, Today defaults to Day 1 without explaining the trip state.
- A traveler still sees the full hero, itinerary overview, guides, forms, and emergency content in the same document. This is the opposite of an exhausted traveler’s “just tell me what is next” need.

### Itinerary

- The dedicated itinerary renders all seven days, destination guides, Disney ride inventories, and dining sections in one ~33,300 px mobile document.
- The horizontal day selector helps jumping, but measured day buttons are only ~34 px high.
- Most content is readable, yet scan cost is high. The current day should be the default view; other days and deep guides should be on demand.

### Weather

- The dedicated forecast is visually clear and includes hourly rain, humidity, UV, wind, clothing, and umbrella advice.
- It is a secondary destination when the key answer—rain in the next few hours and the recommended plan change—belongs directly in Today.
- The data correctness issue described later makes the current presentation misleading.

### Transportation and maps

- Step-by-step route legs, time, fares, IC-card guidance, and exit details are valuable.
- Directions require opening the full itinerary and a modal.
- The Google Maps URL hardcodes the hotel as origin for every route, including arrival and departure. Some destination parameters contain a route-like query rather than a clean destination. A traveler standing in Asakusa or Narita cannot trust this as “directions from where I am.”
- There is no one-tap “from my current location” action and no quick copy of station/exit instructions.

### Budget and expenses

- “Quick Cash Spend” begins around 1,000 px down the mobile page; “Add Paid Expense” around 1,650 px.
- Adding an expense requires title, amount, category, payment method, date, and optional notes. That is manageable for planning, but too heavy for a tired traveler logging a ¥2,500 purchase.
- The top headline numbers are understandable in isolation but misleading together because future planned spending is omitted from Remaining.

### Bookings, documents, emergency, packing, memories

- Bookings default open in Trip Tools, but Trip Tools itself is near the bottom of the home page.
- Tickets without attached files or QR images are only text records; “Available in Official Disney App” does not retrieve the ticket.
- Travel documents are easy to reveal once found, but the current privacy implementation is unsafe.
- Emergency is one tap from the bottom dock and the taxi card is useful. The wrong hotline and missing lost-item playbooks are severe issues.
- Packing works well before departure, but should live under a Prep phase rather than compete with on-trip actions.
- Memories duplicates the phone’s camera/photos workflow and has low on-trip value relative to the storage cost and risk.

**Mobile Travel UX score: 4.5/10.** It is mobile-responsive, but it is not yet mobile-prioritized.

## 3. Visual design audit

### Strong elements

- Cohesive palette and consistent use of deep navy, warm cream, pink, gold, and weather blue.
- The hero has a clear editorial intent, readable overlay, and destination emotion.
- Cards generally have clear labels and good contrast.
- Photography makes itinerary content more approachable.
- Empty states for memories and expenses explain the next action.

### Elements that look like an admin dashboard or AI-generated prototype

- Nearly every concept is a rounded card with a badge, icon, shadow, and explanatory subtitle. The repetition flattens hierarchy.
- Frequent gradients, pills, uppercase micro-labels, emojis, and stock imagery create “AI assembled travel dashboard” signals.
- Dense lists of ride tiers, facilities, dining, budget categories, and technical statuses are presented with similar visual weight.
- Tiny 9–12 px labels appear throughout the operational interface.
- Desktop is spacious but overly long; it uses the extra width without reducing the amount of scrolling or duplication.
- The mobile headers for Weather and Budget are cramped because multiple actions and a long page title share the same 64 px bar.
- Technical footer/product language visibly breaks the consumer illusion.

### Visual recommendation

Do not redesign the brand. Keep the palette and broad editorial direction. Reduce the number of card styles to three: action card, information card, and list row. Use one verified hero image per day; remove decorative stock images from minor events. Load the chosen fonts properly. Let Today be visually sparse and let deep guides be editorial.

**Visual Design score: 6.5/10.**

## 4. Information architecture classification

| Area | Decision | Recommendation |
|---|---|---|
| Today | **KEEP + IMPROVE** | Make it the default task screen: current/next event, leave-by time, rain alert, one route action, relevant ticket, and quick expense. |
| Itinerary | **KEEP + IMPROVE** | Default to one day. Keep a compact seven-day switcher. Collapse deep destination and park content. |
| Places & Guides | **MERGE + MOVE** | Attach each guide to its itinerary day and optionally expose an Explore index. Do not duplicate full guides on Home and Itinerary. |
| Weather | **KEEP + MOVE** | Keep the detailed page, but move the decisive next-3-hours signal and plan recommendation into Today. |
| Transportation | **MERGE** | Embed the relevant route in each event and Today. Do not create another top-level module. |
| Budget | **KEEP + IMPROVE** | Keep the simple trip total and category records. Add committed/projection clarity and a sticky quick-add action. |
| Expenses | **MERGE** | Expenses belong inside Budget; avoid separate navigation terminology. |
| Bookings & Tickets | **KEEP + MOVE** | Make this a first-class Quick Access destination, ordered by today and upcoming use. |
| Travel Documents | **KEEP + MOVE** | Put under Quick Access with local upload, reveal, export/backup messaging, and no public seed files. |
| Packing | **KEEP + MOVE** | Move to a pre-trip Prep section; keep it out of the on-trip primary flow. |
| Memories | **REMOVE FROM CORE / PREMIUM** | The phone photo library already wins. Offer it only as an optional lightweight journal after storage/export is robust. |
| Emergency | **KEEP + IMPROVE** | Keep persistent SOS access. Add verified contacts and lost phone/card/passport playbooks. |

Recommended primary mobile IA: **Today · Plan · Quick Access · Budget · SOS**. Prep/packing and Explore/guides can live within Plan or a More sheet.

## 5. Real-trip scenario test

| Scenario | Current result | Assessment |
|---|---|---|
| A. Just landed at Narita | Arrival content exists, but the current “Up Next” may still show the Manila lounge. Transit is buried and the Maps origin is wrong. | **Poor** |
| B. In Asakusa, need next activity | Today shows the first event, not the next event by time. | **Poor** |
| C. It is raining | Rain plans and a toggle exist, but the toggle is manual and weather days can be mislabeled. No direct “switch today” recommendation. | **Partial** |
| D. Need attraction directions | Route steps are useful, but require several actions and Maps construction is unreliable. | **Partial/Poor** |
| E. Need attraction ticket now | Bookings are far down Home; several ticket records have no file/QR and redirect the user mentally to another app. | **Poor** |
| F. Record ¥2,500 | Possible, with categories and payment method, but the quick action is below the first viewport and the form is too long for a quick log. | **Partial** |
| G. Know money left | A Remaining value is shown, but it ignores ¥210,000 of planned future spending. The computed projected remainder is not displayed. | **Misleading** |
| H. Need passport/insurance copy | Passport/visa images are accessible, but current copies are publicly deployed. Insurance is descriptive text, not a retrievable policy document/contact. | **Unsafe/Incomplete** |
| I. Lost phone/card/passport | Emergency calls exist; there are no insurer, embassy/consulate, bank-block, lost-property, or passport replacement steps. The visitor hotline is wrong. | **Poor** |
| J. Exhausted; want “what’s next?” | The product does not calculate it. | **Poor** |

## 6. Budget review

### What is understandable

- Planned Budget, Actual Spent, and Remaining are familiar concepts.
- JPY is appropriately dominant on the ground, with PHP shown as context.
- Paid and planned lists are editable, categorized, date-stamped, and sortable.
- Mark as Paid sensibly moves an expected item into actual spending and allows confirmation of amount, date, and method.
- Cash withdrawn minus cash spending is understandable for travelers who actively manage a cash wallet.

### What is confusing or incorrect

- At the observed default, the budget is roughly ¥405,000, paid spending ¥283,015, and planned future spending ¥210,000. The interface presents approximately ¥121,985 Remaining, while the true projected result after commitments is about **−¥88,015**. The code calculates that projection but never renders it.
- The home summary reads a `v2` LocalStorage key while Budget writes `v3`, causing Home to show Paid ¥0 while Budget shows five or more paid records.
- A hotel marked “Pay Later” is counted as Actual Spent/Paid. “Paid,” “booked,” and “committed” are conflated.
- The target is entered in PHP, converted to JPY using a live exchange rate, and therefore changes over time. A budget target should use a user-chosen planning rate or one stable base currency.
- Previously converted PHP-origin costs are stored as JPY and then converted back using today’s live rate, so displayed PHP comparisons drift.
- Payment methods are hardcoded to this owner’s Philippine cards and wallets.
- “Fixed / Actual Budget” sounds like accounting. “Paid & committed” and “Planned” are simpler.
- There is no clear recent-expense history summary or undo after deletion.
- Telegram sync is prominently exposed despite being an optional, technically fragile add-on.

### Recommended simple model

Use four headline numbers only:

1. Trip budget
2. Paid
3. Committed but not paid
4. Available after commitments

Keep “cash in wallet” as an optional collapsed panel. Make the primary quick-add form Amount, Category, and Payment Method; date defaults to today and details can be added later.

## 7. Sellability

### Strongest buyer

The strongest initial customer is **a nontechnical solo traveler or couple taking a carefully planned 5–10 day international city trip who currently stitches together Google Docs/Sheets, screenshots, booking emails, and Google Maps**.

Do not target families/groups first: local-only device data does not sync across travelers. Do not target travel agents first: there is no multi-client workflow. Do not target “everyone who travels.”

### One-sentence positioning

**A personalized, mobile-first trip companion that puts today’s next step, routes, tickets, budget, documents, and emergency help in one calm place—even when the traveler is tired or offline.**

### Does the current product deliver it?

Only partially. It contains all of those categories, but it does not yet prioritize the next step, safely store the current seeded documents, reliably retrieve every ticket, or work offline as claimed. It delivers breadth, not dependable calm.

## 8. Sellable versus personal-only features

### A. Essential to the sellable template

- Focused Today screen
- Day-by-day itinerary with time and status
- Event-specific routes and map actions
- Today/upcoming ticket quick access
- Local booking/document upload
- Simple budget and quick expense log
- Verified destination emergency information and hotel taxi card
- Packing checklist
- Import/export and storage explanation

### B. Nice premium features

- Weather-aware alternate plans
- Live FX with a user-set planning rate
- Curated destination guides
- Verified attraction/restaurant guidance with “last checked” dates
- Actual offline app shell and downloadable trip pack
- Optional memory journal

### C. Personal TravelTokyo content that must be configurable

- Tokyo/Japan names, Japanese title, dates, time zone, coordinates, hero and day images
- Five traveler identities, PNRs, visa details, hotel, flights, lounges, cards, and booking references
- PHP/JPY currency and conversion labels
- Every itinerary event, rain plan, route, fare, station, exit, food quest, Disney guide, restaurant, etiquette rule, souvenir district, and packing preset
- Emergency numbers, phrases, embassy/insurer/bank contacts
- Payment methods, budget seeds, cash threshold, and LocalStorage/IndexedDB namespace
- PWA metadata, page titles, Open Graph copy, footer copy, DB name, and file paths

### D. Complexity without enough buyer value

- Telegram/n8n sync in the core product
- Serverless `/tmp` expense persistence
- Full memories gallery by default
- A separate physical-cash accounting subsystem for every buyer
- Full Disney ride and dining databases in a generic destination template
- Duplicate full itinerary/guide experiences on Home and the detailed route

## 9. Customization test

### Can it become TravelSeoul, TravelOsaka, or TravelParis without rewriting?

**No.** The main travel content is centralized, but the application shell and logic are not destination-agnostic.

Key hardcodes outside `trip-config.ts` include:

- Today’s September 1, 2026 start date and Japan offset
- “Tokyo” hero/title copy and image alt text
- Weather fallback dates, descriptions, clothes, hourly labels, and `Asia/Tokyo` API timezone
- Weather mapping that assumes API day index equals itinerary day index
- Page headings and metadata (“7-Day Tokyo,” September dates, Tokyo Standard Time)
- Hotel origin and Tokyo destination fallback in Google Maps URLs
- Day-number-to-route and day-number-to-guide conditionals
- Disneyland/DisneySea filtering and dates
- Asakusa labels and destination-specific tips in components
- All default paid/planned expenses and payment methods
- Storage keys prefixed `travel_tokyo_` and database name `TravelTokyoDB`
- PWA manifest and Open Graph metadata
- Default memory caption/location
- Japan-specific document labels, visa status, insurance copy, phrases, and emergency copy
- Public file paths for personal documents

The configuration file is also 2,267 lines long. Centralized is not the same as easy to customize.

### What must become configurable

Create one versioned `TripConfig` containing identity/theme, locale/time zone, currencies, travelers, stay, transport, itinerary, bookings, budget/payment methods, packing, emergency, guide modules, and feature flags. Routes need explicit `origin`, `destination`, and optional current-location behavior. Derived UI copy should come from config data rather than naming Tokyo, Disney, PHP, or JPY in components.

## 10. Buyer setup

An ordinary buyer cannot currently customize destination, dates, travelers, hotel, flights, itinerary, places, budget, bookings, photos, or emergency contacts without editing TypeScript and deploying through GitHub/Vercel.

The simplest solution is **not** a CMS, login, Supabase, or SaaS backend. Add a local Setup mode:

- A guided form for trip basics, travelers, stays/flights, days/events, budget, and emergency contacts
- Image/file upload on the buyer’s device
- Preview as they edit
- Export/import a single versioned trip JSON backup
- A “Reset to sample trip” action
- Feature toggles for guides, cash tracking, memories, and optional automation

For a public customized deployment, the most realistic commercial offer remains a concierge service: the buyer completes an intake form, and the seller generates/deploys the static configuration. A source-code product is for technical buyers unless setup and deployment are dramatically simplified.

## 11. Privacy and local storage

### Appropriate model

- LocalStorage is appropriate for checkmarks, small settings, budget rows, and lightweight structured data.
- IndexedDB is appropriate for uploaded PDFs/images and photos.
- No account/database is required for a personal single-device template.

### Required buyer message

“Your uploaded documents and photos stay in this browser on this device. They are not synced to an account or backed up automatically. Clearing browser/site data, using private browsing, changing devices, or uninstalling the app can permanently remove them. Export a backup before travel and keep an independent secure copy.”

Also explain that local browser storage is not encryption, device passcode/biometrics remain important, and a visual blur only protects against shoulder-surfing.

### Current critical exception

The bundled passport, visa, and hotel files are under `public/documents` and referenced by public URLs. Remove all real personal documents from the repository, deployment history, and live hosting; rotate or replace any exposed identifiers as appropriate. Default/demo content must use fictional redacted samples. User uploads can remain in IndexedDB.

Add storage usage, export/backup, delete-all, and restore controls before selling.

## 12. What is missing, prioritized

### P0 — must fix before selling

1. **Trust and privacy:** remove public personal files, use fictional demos, remove or secure the open expense API, and provide truthful storage disclosure/export.
2. **Correctness and safety:** fix trip-date weather fetching, map origins/destinations, current official emergency contacts, budget projection/statuses, and cross-page storage keys.
3. **True Today mode:** time-aware next event, overdue/current/next states, leave-by route, today’s ticket, weather interruption, and a quick expense action.
4. **Durability:** persist default bookings correctly, make delete persistent, handle file quota/errors, and either implement a real offline app shell or remove the offline/PWA claim.
5. **Commercial configuration:** no-code local setup/import/export plus complete removal of Tokyo/owner hardcodes from the shell.

### P1 — strongly improves the product

- Simplify mobile IA to Today, Plan, Quick Access, Budget, SOS
- Render one itinerary day at a time and collapse deep guides
- Increase tap targets to at least 44 px and fix active navigation states
- Add lost phone/card/passport/medical playbooks and insurer/embassy/bank contacts
- Add verified/last-checked labels to time-sensitive attraction, fare, and dining content
- Compress images and reduce decorative remote photography

### P2 — later

- Optional themes and destination starter packs
- Optional memory journal after backup/export is robust
- Optional automation add-on with a narrowly scoped secret and clear setup
- Lightweight spend-category insights

## 13. What should not be built

- Accounts, teams, roles, or social profiles
- Supabase or another database merely to synchronize one traveler’s trip
- A travel-agent CRM or multi-client dashboard
- Built-in flight/hotel booking engines
- Live train routing to compete with Google Maps
- AI itinerary chat inside the product
- Native iOS/Android apps before the web flow is excellent
- Complex receipts/OCR, reimbursements, split bills, or accounting reports
- Social feeds, public memory galleries, or community reviews
- Real-time group collaboration until a paying segment clearly requires it
- More guide categories before Today, tickets, safety, and offline reliability work

The product should orchestrate prepared information and hand off to specialist apps; it should not recreate them.

## 14. Pricing and product format

These are introductory ranges after the P0 fixes, not current-state prices. Current marketplace context ranges from about $16 for a Notion travel template to roughly $149–$500+ for many seven-day custom planning services; TravelTokyo’s website delivery adds value, but research and manual configuration remain labor-intensive.

| Format | Target customer | Included | Introductory price | Advantages | Disadvantages |
|---|---|---|---:|---|---|
| A. Source-code/template | Technical creators, junior developers, travel bloggers | Code, fictional demo, setup screen, documentation, reusable config, updates for a defined period | **US$39–69 / ₱2,300–4,000** | Scalable, low fulfillment cost, showcases design/engineering | Small technical market; support burden; easy alternatives are cheaper; must be genuinely reusable |
| B. Personalized travel website service | Nontechnical solo travelers/couples who already have an itinerary and bookings | Intake, one 5–10 day single-city site, data entry, deployment, document-upload handoff, one revision | **₱6,500–12,000 / about US$115–210** | Best match for current product; buyer avoids setup | Manual work; privacy/support expectations; scope must be strict |
| C. Premium custom itinerary + companion | Busy travelers who want planning as well as delivery | Research, paced itinerary, routes, weather alternatives, guide curation, budget structure, configured site, two revisions | **₱15,000–28,000 / about US$260–490** | Strongest differentiation and willingness to pay; sells outcome, not code | High labor, research liability, time-sensitive verification, difficult to scale |

Do not sell the current build as a $100+ generic source template. The strongest near-term format is **B**, then **C** once the research workflow and verification standards are repeatable.

## 15. Competitive value

### Why someone might pay

TravelTokyo can combine the exact day plan, rain alternative, route/fare context, booking reference, local document, budget state, hotel taxi card, packing, and emergency information in a single trip-branded interface. Google Docs/Sheets/Notion can hold the information but do not automatically surface the next event and its relevant route/ticket. Google Maps routes well but does not know the traveler’s prepared plan or documents. ChatGPT can advise but is not a dependable local source of confirmed bookings and records.

### Why the current version is not yet compelling enough

Today does not actually surface the next event; Google Maps construction is unreliable; the booking/document flow is not trustworthy; the site is not truly offline; and the budget headline can mislead. In that state, the user is safer with Maps + Notes/Docs + booking apps.

The compelling reason to pay is created when TravelTokyo reliably does this:

> Open one screen, see what is happening now and next, tap the correct route or ticket, and continue even with poor connectivity.

It should complement Google Maps, wallet/booking apps, and the phone’s secure storage—not claim to replace them.

## 16. Final verdict and the only five changes before selling

**SELLABLE AFTER MAJOR CHANGES**

### #1 — Establish trust: remove exposed personal data and unsafe integrations

Delete real passport/visa/hotel files from public deployment and repository history, replace them with fictional redacted samples, keep buyer uploads device-local, add export/delete/storage disclosure, and remove the unauthenticated cross-origin expense API/Telegram sync from the default product.

### #2 — Turn Today into the product

Create a genuinely focused, time-aware screen showing current/next activity, leave-by time, immediate route, relevant ticket, weather disruption, and one-tap expense entry. This is the paid value proposition.

### #3 — Fix every trust-critical calculation and signal

Map forecasts to actual trip dates/time zone, build directions from explicit/current origins, use current official emergency contacts, show available-after-commitments, distinguish paid from committed, unify storage keys, and make booking add/delete behavior durable.

### #4 — Cut the mobile information architecture down

Use Today, Plan, Quick Access, Budget, and SOS; display one day at a time; move guides into day details; move packing into Prep; make memories optional; use 44 px minimum targets; remove duplicate content and technical language.

### #5 — Make customization real for a nondeveloper

Add a local setup wizard plus JSON import/export, feature flags, fictional starter data, configurable theme/metadata/time zone/currencies/payment methods, and a truthful offline mode. Keep the product backend-free.

## Evidence and implementation notes

- Live mobile home measured approximately 10,591 px high; Tools began around 7,605 px and Emergency around 8,666 px.
- Live mobile detailed itinerary measured approximately 33,290 px high.
- Bottom navigation controls measured approximately 32 px high; day-jump buttons approximately 34 px.
- Quick Cash Spend began around 1,001 px down the mobile Budget page; Add Paid Expense around 1,656 px.
- TypeScript passed with `--noEmit --incremental false`.
- ESLint reported 5 errors and 35 warnings.
- No service-worker/app-shell caching implementation was found; the manifest alone does not make the product offline-capable.
- The repository had pre-existing uncommitted changes (`src/app/api/expenses/route.ts` and `update_n8n.py`) during review. They were not modified.

### Safety references

- JNTO Japan Visitor Hotline: https://www.japan.travel/en/plan/hotline/ — 050-3816-2787 in Japan, +81-50-3816-2787 from overseas, 24/7.
- Tokyo Metropolitan Police: https://www.keishicho.metro.tokyo.lg.jp/multilingual/english/ — 110 for urgent crime/accident; #9110 for non-emergency advice.
- Fire and Disaster Management Agency ambulance guidance: https://www.fdma.go.jp/publication/portal/items/portal001_pamphiet_english.pdf — 119 for ambulance/fire.

### Pricing reference points

- Etsy Notion travel template observed at $16.40: https://www.etsy.com/listing/1642328879/notion-travel-planner-template-vacation
- Travel Blue Book seven-day custom itinerary at $299: https://travelbluebook.com/custom-itineraries/
- Day Trip Nomad seven-day tiers at $250/$500/$750: https://daytripnomad.com/itinerary-planning-services/
- Trawoa seven-day full planning example at $149 minimum: https://www.trawoa.com/hire-a-travel-planner/

---

## External review input: Antigravity — preserved

Status: **Added August 28, 2026. Included in the final evidence-weighted synthesis below.**

This section records Antigravity’s independent assessment as a separate input. Its conclusions have not been blended into the main audit or scorecard above.

### Antigravity’s overall position

- First Impression: **8.5/10**
- Visual Design: **8.8/10**
- Mobile UX: **7.5/10**
- Trip Utility: **9.2/10**
- Ease of Use: **8.5/10**
- Customization: **5.5/10**
- Technical Quality: **8.5/10**
- Sellability Today: **5/10**
- Sellability After P0 Fixes: **9/10**
- Verdict: **SELLABLE AFTER MINOR CHANGES**

Antigravity sees TravelTokyo as a high-value, bespoke consumer travel app with strong editorial styling, a boutique-agency feel, excellent trip utility, and comparatively minor commercialization work remaining.

### Strong contributions from Antigravity

Antigravity describes the product’s visual and emotional strengths particularly well:

- The kanji identity, cream background, navy/pink/gold palette, and twilight photography create stronger perceived value than a spreadsheet or generic template.
- The product avoids the usual sidebar-heavy admin-dashboard appearance.
- Routing between the long home experience and dedicated subpages creates navigational dissonance.
- The bottom navigation should persist across Itinerary, Weather, and Budget.
- The duplicate Home and detailed itinerary experiences should be consolidated.
- Packing belongs in a pre-trip preparation area.
- Currency symbols, payment methods, coordinates, dates, Disney categories, and emergency phrases require configuration.
- A local Setup screen and JSON import/export are the correct backend-free customization approach.
- Telegram/n8n should remain an optional add-on.
- Accounts, heavy databases, an accounting engine, and custom map infrastructure would be feature creep.
- Image compression and local backup are worthwhile safeguards.

Its strongest commercial insight is the “Trip Captain”: the person organizing a family/group trip who repeatedly answers questions about timing, transport, bookings, and the hotel. This is a plausible secondary customer or a strong buyer for the done-for-you service. The limitation is that local-only records do not synchronize across the group, so the current product cannot yet fully serve a shared group use case.

### Antigravity’s five recommended pre-sale changes

1. De-personalize and parameterize names, PNRs, cards, currencies, and trip dates.
2. Add the persistent mobile dock to all routes.
3. Remove duplicate itinerary content from Home.
4. Generalize guides and emergency content.
5. Add local JSON backup/export.

These recommendations align closely with the main audit, but omit several trust-critical correctness fixes.

### Evidence conflicts to resolve in the final synthesis

| Antigravity claim | Live/code evidence | Final synthesis treatment |
|---|---|---|
| Mobile buttons are at least 48 px and touch targets are “good.” | Measured bottom-dock controls were ~32 px high, itinerary day buttons ~34 px, and several transit/actions ~38 px. | Treat mobile tap sizing as a confirmed usability issue. |
| Offline reliability is “superb” or 100% because data uses LocalStorage/IndexedDB. | No service worker or app-shell caching implementation was found. Local data may exist while the application and its 84 remote images remain unavailable offline. | Do not call the product offline-capable until caching is implemented and tested. |
| Passport blur is a privacy/security strength. | Blur helps only with shoulder-surfing. Current real files are under public web paths and can be opened directly. | Preserve blur as a small UX feature, but classify the deployment as a P0 privacy failure. |
| Bookings/tickets load in subway tunnels. | Uploaded IndexedDB files may remain local, but the app shell is not cached; default ticket records often have no attached QR/file. | Mark retrieval as incomplete and offline behavior unproven. |
| All ten real-trip scenarios pass. | Today always selects the first event; Maps origin is hardcoded to the hotel; several tickets have no file; budget Remaining excludes commitments; loss workflows are missing; the visitor hotline is wrong. | Use the scenario-by-scenario results in the main audit, not the blanket PASS rating. |
| “Up Next” answers what is next. | The component uses `sunPlan[0]` rather than comparing event time with current destination time. | Confirm as a P0 product-logic gap. |
| Google Maps handoff is clean and reliable. | The detailed itinerary builds every route with the hotel as origin, including airport arrival/departure, and may pass a route description as the destination. | Require explicit/current origin and clean destination values. |
| Budget Remaining provides a reliable live balance. | Planned future expenses are excluded. The code calculates projected remaining but does not show it. Home reads paid-expense storage `v2`; Budget writes `v3`. | Treat current headline as potentially misleading. |
| Quick Cash Spend is a 2–3 tap action. | On mobile the action begins roughly 1,001 px down Budget, after the summary and cash header; the modal asks for multiple fields. | Keep the feature but require a truly immediate shortcut and shorter form. |
| Emergency scenario passes through 110/119 and taxi card. | Lost phone/card/passport procedures are absent. The displayed 0570-000-911 visitor hotline does not match the current official JNTO 050-3816-2787 hotline. | Treat emergency verification and loss playbooks as P0. |
| Homepage is about 4,500 px high on mobile. | Live measurement was approximately 10,591 px; the detailed itinerary was approximately 33,290 px. | Use measured dimensions. |
| Technical Quality is 8.5/10. | ESLint reports 5 errors and 35 warnings; the expense endpoint is unauthenticated and nondurable; booking defaults and deletion are inconsistent; offline claims are unsupported. | Retain the main audit’s materially lower technical score unless later evidence contradicts it. |
| Sellable after minor changes. | Privacy exposure, safety/contact errors, forecast/date mismatch, map bugs, persistence inconsistency, false offline claims, and lack of nondeveloper setup are substantive. | Current evidence supports “SELLABLE AFTER MAJOR CHANGES.” |

### Pricing perspective contributed by Antigravity

- Source-code template: **US$29–49**
- Done-for-you personalized website: **US$99–199**
- Prebuilt Tokyo itinerary + companion bundle: **US$39–59**

These are useful lower-bound introductory prices. Antigravity’s third format differs from the requested “premium custom itinerary + travel companion” format: it prices a ready-made Tokyo guide rather than custom research and delivery. The final synthesis should keep those as separate product offers.

### Provisional assessment of Antigravity’s review

Antigravity is strongest as a **brand, visual-design, packaging, and positive-value articulation**. It is less reliable as a **mobile measurement, security, offline, state/persistence, and real-trip failure audit**. Its scorecard should not be averaged mechanically with the main audit or Claude’s review. The final combined report reconciles each factual claim against observable UI behavior and code, while retaining Antigravity’s clearer articulation of why the product feels special.

---

## External review input: Claude — preserved

Status: **Added August 28, 2026. Included in the final evidence-weighted synthesis below.**

### Claude’s overall position

- First Impression: **7/10**
- Visual Design: **7/10**
- Mobile UX: **6/10**
- Trip Utility: **8/10**
- Ease of Use: **6/10**
- Customization: **3/10**
- Technical Quality: **6/10**
- Sellability Today: **3/10**
- Sellability After P0 Fixes: **7/10**
- Verdict: **NOT SELLABLE YET**

Claude sees a thoughtful, unusually complete personal travel companion with genuine day-of-trip value, but not yet a repeatable product. Its central diagnosis is that the current build is a hardcoded family trip whose responsive shell, information architecture, and setup experience need productization.

### Strong contributions from Claude

Claude is the more balanced and evidence-oriented of the two external reviews. It independently identifies several important issues found in the main audit:

- Sticky subpage headers wrap, clip, or collide at common mobile and tablet widths, improving only near desktop width.
- The bottom navigation disappears on subpages, weakening orientation and increasing backtracking.
- Home hash links such as `/#tools` do not reliably place users at the requested section.
- Home and the detailed itinerary duplicate content and create excessively long pages.
- Tickets and documents are buried despite being high-frequency travel-day needs.
- Packing should be moved into pre-trip preparation, and Memories should be optional.
- Trip identity, itinerary data, routes, day-guide mappings, currencies, payment methods, Disney categories, and emergency content remain hardcoded across the codebase.
- A centralized configuration model, example data, and a one-page setup guide are necessary for a source-code product.
- Local browser storage is a reasonable backend-free architecture, but buyers need a clear storage, privacy, backup, and deletion explanation.
- Telegram/n8n should be optional rather than part of the core setup.

Claude also contributes a useful product distinction: a technical source-template buyer can tolerate config-file setup with excellent documentation; a nondeveloper buyer cannot. That difference should shape packaging rather than forcing one setup promise across all offers.

### Evidence conflicts and omissions

| Claude claim or treatment | Live/code evidence | Final synthesis treatment |
|---|---|---|
| Offline capability is presented as a real strength. | No service worker or app-shell caching was found, and the experience depends on many remote images. LocalStorage/IndexedDB alone do not make the app load offline. | Remove the offline claim or implement and test real offline caching. |
| Passport blur and browser-local storage are treated as strong privacy safeguards. | Blur only protects against casual viewing. Current real passport, visa, and hotel files are publicly addressable assets. | Public document exposure remains a P0 blocker regardless of blur. |
| The budget balance is treated as prominent and broadly correct. | “Remaining” excludes planned commitments; projected remaining is calculated but not shown; Home and Budget use different paid-expense storage versions. | Treat the headline balance as potentially misleading until the model and storage keys are fixed. |
| Several itinerary, document, budget, and emergency scenarios are rated Good. | Directions can start from the wrong origin, tickets may lack attached files, documents are public, the hotline is outdated, and loss playbooks are missing. | Preserve Claude’s usability observations, but use the main audit’s lower scenario ratings. |
| A setup editor can wait until after v1. | This is viable only if v1 is explicitly sold to technical buyers or delivered as a done-for-you service. It conflicts with a direct nondeveloper-template promise. | Make the promise package-specific: config guide for developers; guided setup/import for nondevelopers. |
| Technical quality is 6/10. | The responsive shell is broken at common widths; the expense API is unauthenticated and nondurable; persistence is inconsistent; ESLint reports errors; offline claims are unsupported. | Use a lower evidence-weighted technical score. |

### Pricing perspective contributed by Claude

- Source-code template: **US$29–59**
- Done-for-you personalized website: **₱3,000–8,000**
- Premium custom itinerary + companion: **₱8,000–20,000+**

These ranges are directionally sensible for an introductory offer. The lower end of the done-for-you range risks underpricing intake, data cleanup, document handling, deployment, testing, support, and revision time. Premium custom work should be priced by trip length, traveler count, research complexity, and revision scope.

### Assessment of Claude’s review

Claude is strongest on **responsive usability, navigation continuity, information architecture, customization effort, and realistic sellability**. It is more reliable than Antigravity as a current-state product audit. However, it still underweights the most serious privacy, correctness, persistence, and offline failures. Its `NOT SELLABLE YET` conclusion is supported, but the route to sale is somewhat larger than its proposed setup/documentation work suggests.

---

## Final three-way synthesis: Codex + Antigravity + Claude

This synthesis is evidence-weighted, not a simple average. Antigravity’s strongest contribution is explaining the product’s emotional and commercial appeal. Claude’s strongest contribution is diagnosing responsive and productization issues. The main live/code audit carries the most weight where claims concern measurements, data flow, privacy, offline behavior, persistence, safety, or calculation correctness.

### Where all three perspectives converge

- The product has a distinctive, premium-feeling visual identity and is more emotionally engaging than a spreadsheet or generic itinerary template.
- Its strongest value is reducing trip-day cognitive load for a traveler or “Trip Captain.”
- Navigation and information architecture need simplification; the duplicate long itinerary is a major source of friction.
- High-frequency content—today’s plan, routes, tickets, documents, budget, and emergency help—must be easier to reach.
- Hardcoded trip details must move into centralized configuration.
- Local backup/export and a truthful privacy explanation are required.
- Telegram/n8n is optional enhancement work, not core product value.
- The product should avoid accounts, heavy collaborative infrastructure, custom maps, and accounting-grade complexity in v1.

### Resolved disagreements

- **Visual quality:** Antigravity’s 8.8 captures the brand promise; the main audit and Claude correctly discount the result for typography, density, and responsive breakage. Combined result: **7/10**.
- **Mobile quality:** The measured tap targets, enormous page lengths, disappearing dock, and broken subpage headers outweigh positive visual impressions. Combined result: **5/10**.
- **Trip utility:** The information set is strong, but wrong origins, a non-time-aware Today card, buried tickets, misleading budget logic, and incomplete emergency recovery flows prevent a high operational score. Combined result: **6.5/10**.
- **Offline/privacy:** Local storage is a promising architectural direction, not proof of offline safety or privacy. Public personal files and the missing service worker are decisive blockers.
- **Setup scope:** A config file and setup guide can support a technical source-template offer. A guided local setup/import experience is required before marketing the same template directly to nondevelopers. Done-for-you buyers should never need to edit code.
- **Sellability:** Antigravity’s “minor changes” assessment is not supported by the evidence. Claude’s “not sellable yet” matches the present state; the main audit’s “sellable after major changes” accurately describes the path forward.

### Final evidence-weighted scorecard

| Dimension | Combined score | Synthesis |
|---|---:|---|
| First Impression | **7/10** | Distinctive and clearly travel-focused, but dense before its core promise becomes obvious. |
| Visual Design | **7/10** | Strong palette and personality; typography, density, consistency, and responsive composition need refinement. |
| Mobile UX | **5/10** | Useful concepts undermined by header collisions, missing persistent navigation, small targets, deep-link failures, and extreme scrolling. |
| Trip Utility | **6.5/10** | Rich trip coverage, but several high-stakes actions are slow, incorrect, incomplete, or insufficiently durable. |
| Ease of Use | **6/10** | Understandable at a glance, but the architecture makes frequent actions harder than necessary. |
| Customization | **3/10** | Still a hardcoded personal trip, not a repeatable buyer-ready system. |
| Technical Quality | **4.5/10** | Solid framework foundation and passing TypeScript, offset by privacy, API, persistence, responsive, lint, and offline problems. |
| Sellability Today | **2.5/10** | The experience demonstrates value but cannot responsibly be sold in its current deployed state. |
| Sellability After P0 Fixes | **7.5/10** | A credible paid beta or boutique service after trust, correctness, mobile shell, and setup work. |

## Final verdict

**NOT SELLABLE YET**

This is the present-state commercial verdict. It does not mean the concept needs a redesign. The product has a good core and a credible path to sale, but the remaining work is **major productization**, not minor polish. Once the five changes below are complete and verified, it becomes suitable for a paid beta and can reasonably be described as **sellable after major changes**.

## The only five things to change before selling

### 1. Fix trust, privacy, and safety

Remove real personal documents from public assets and repository history; replace them with fictional samples; remove or secure the global expense endpoint; disclose local storage and deletion behavior; correct the visitor hotline; and add lost phone, card, passport, and document-recovery playbooks.

### 2. Repair the mobile shell and navigation

Fix every sticky header at 320–1024 px; keep a compact persistent navigation model on all core routes; use text labels and at least 44 px targets; make section links land correctly; and give Tickets/Quick Access a first-class destination.

### 3. Make Today genuinely useful in the moment

Use destination time to show the actual current and next activity, leave-by time, route from the correct/current origin, relevant ticket or QR, weather disruption, and one-tap expense entry. This should become the default trip-day screen.

### 4. Correct and harden the core data behavior

Map forecasts to real trip dates; fix route origins and destinations; show available-after-commitments; unify storage keys; make booking additions/deletions durable; provide tested export/import; and either implement a service worker with an offline test matrix or remove every offline claim.

### 5. Productize setup around the buyer type

Centralize all traveler, trip, itinerary, route, budget, currency, payment, guide, emergency, feature, theme, and metadata values. Ship fictional example data, validation, and a short setup guide for technical source buyers. Add guided local setup or structured import before calling the template nondeveloper-friendly. Handle setup completely inside the done-for-you and premium offers.

## Consolidated offer and pricing recommendation

| Offer | Buyer | Recommended launch range | Boundary |
|---|---|---:|---|
| Source-code template | Technical DIY buyer | **US$39–59** | Central config, example data, guide, updates; no personal setup. |
| Ready-made Tokyo companion | Traveler who wants curated Tokyo content | **US$39–59** | Generic guide/content bundle, clearly separate from custom planning. |
| Done-for-you personalized site | Busy traveler or Trip Captain | **₱6,000–12,000** | One trip, defined intake, configuration, deployment, one revision, limited support. |
| Premium custom itinerary + companion | Buyer seeking research and planning | **₱15,000–25,000+** | Custom research and route design; scale by trip length, travelers, complexity, and revisions. |

Do not sell the source template to nondevelopers under the current setup promise. For the earliest revenue, the strongest route is a small done-for-you paid beta after the five P0 changes, followed by a technical source-template release once configuration and documentation are complete.
