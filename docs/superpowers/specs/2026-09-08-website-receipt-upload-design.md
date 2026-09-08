# Website Receipt Upload (AI-Categorized) — Design

Status: Approved by user, ready for implementation planning.

## Context

Receipts were previously logged by sending photos/text to a Telegram bot, which
an external n8n workflow parsed via Google Gemini and posted to `/api/expenses`.
That path is being retired in favor of uploading receipts directly on the
TravelTokyo website. The user made two decisions during brainstorming:

- Auto-save AI-extracted expenses immediately; allow editing afterward on the
  website (no back-and-forth clarification chat like Telegram had).
- Do not touch or clean up the existing Telegram/n8n code path
  (`syncExpensesFromAPI` polling in `src/app/budget/page.tsx`, the
  `/tmp`-file-backed store in `src/app/api/expenses/route.ts`, and the n8n
  workflow itself). It stays exactly as-is, dormant or not.

This is a new feature addition alongside existing code, not a replacement of
existing storage or expense-editing UI.

## Goal

Let the user upload receipt images (and/or type a plain-text expense note)
directly on the Budget page. An AI call extracts title, amount, currency
(JPY or PHP), category, payment method, date, and notes, then the page
auto-saves the result as a new paid expense using the exact same local-storage
persistence and JPY/PHP conversion logic the manual "Add Expense" form already
uses. If the AI is unsure or the amount is missing, the record still gets
created as a flagged draft and the existing edit modal opens immediately,
pre-filled, so the user completes it right there.

## Non-goals (explicitly out of scope for this spec)

- The "adjusted price in JPY↔PHP due to credit card FX markup" feature —
  deferred to a future spec.
- PDF receipt support — only images and typed text for now.
- Any change to the Telegram/n8n workflow or its server-side plumbing in
  `src/app/api/expenses/route.ts` — left untouched.
- A shared/extracted prompt module between n8n and the website — the two
  environments are independent; the website gets its own copy of the
  prompt/schema logic in its own API route.

## Architecture

```
Budget page (client)
  └─ Upload Receipt panel (new)
       ├─ file picker / dropzone (multi-select images)
       ├─ plain-text input (typed expense note)
       └─ per-item status list (Processing / Added / Needs Review / Error)
            │
            ▼ POST (one file or text at a time)
     /api/parse-receipt  (new, server-side Next.js route)
            │
            ▼ POST (server-to-server, holds GEMINI_API_KEY)
     Google Gemini generateContent API (gemini-3.6-flash)
            │
            ▼ structured JSON response
     /api/parse-receipt returns { is_expense, title, amount, currency,
                                   category, paymentMethod, date, notes,
                                   confidence: "ok" | "needs_review" }
            │
            ▼
     Client builds ExpenseRecord using the SAME conversion logic as
     handleSaveForm() in budget/page.tsx (fxRate-aware JPY/PHP handling),
     then setPaidExpenses(prev => [newRecord, ...prev]) — same
     localStorage-backed persistence as manual entries, no server database.
```

No new persistent server-side storage is introduced. `/api/parse-receipt` is
stateless: it receives one file/text, calls Gemini, returns parsed JSON, and
keeps nothing.

## Components

### 1. `/api/parse-receipt` (new route, `src/app/api/parse-receipt/route.ts`)

- `POST` only. Accepts JSON body: either `{ imageBase64: string, mimeType: string }`
  or `{ text: string }`.
- Reads `GEMINI_API_KEY` from a server-side environment variable (never sent
  to the client). Must be added to Vercel project env vars and local `.env.local`.
- Calls `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent`
  with a prompt adapted from the (already-fixed) n8n prompt: extracts
  `is_expense`, `non_expense_reason`, `title`, `amount` (in its original
  currency), `currency` ('JPY' or 'PHP'), `category`, `paymentMethod`, `date`,
  `notes`. Same rule as the n8n fix: a PHP-denominated receipt is valid and
  must never be treated as unparseable just for being PHP.
- Unlike the n8n version, this route does NOT have a "needs_clarification"
  dead end. Instead: if `is_expense` is false, or `amount` is missing/zero, or
  Gemini's own confidence is otherwise low, the route still returns whatever
  fields it could extract plus `confidence: "needs_review"` rather than
  rejecting the upload outright. The client is responsible for turning that
  into an editable draft (see below) instead of blocking.
- Error handling: Gemini network/HTTP failure, quota errors, or malformed
  JSON output all return a clear `{ success: false, error }` response with an
  appropriate HTTP status, so the client can show a retry option rather than
  failing silently the way the old Telegram path did.

### 2. Upload Receipt panel (new component: `src/components/ReceiptUpload.tsx`,
   used by `src/app/budget/page.tsx`)

`budget/page.tsx` is already ~1,565 lines; the upload panel's file-queue and
per-item status logic is self-contained enough to live in its own component
rather than growing that file further. It receives `paidExpenses`,
`setPaidExpenses`, `fxRate`, and `openEditModal` as props from the budget
page, so it reuses the page's existing state and modal instead of duplicating
either.

- File input (`multiple`, `accept="image/*"`) plus a plain-text field for
  typed notes.
- On selection, files are queued and processed **one at a time** (sequential,
  not parallel) to stay within Gemini rate limits and to keep per-item status
  legible. Each item shows one of: Processing… / Added ✓ (title + amount) /
  Needs Review ⚠️ / Error (with Retry).
- For each file: read as base64 client-side, `POST` to `/api/parse-receipt`.
- On a successful, confident response: build an `ExpenseRecord` using the
  exact same amount/currency logic as `handleSaveForm()` (amount always
  stored in JPY as the canonical figure; `convertedAmountPHP` set to the
  original PHP figure when the source was PHP), then
  `setPaidExpenses(prev => [newRecord, ...prev])`.
- On a `needs_review` response (or non-expense with no clear reason to
  discard, e.g. AI wasn't sure): still create the record (with whatever
  fields were extracted, defaulting missing amount to `0` and title to the
  filename or "Uploaded Receipt"), add it to `paidExpenses` the same way, AND
  immediately call the existing `openEditModal(newRecord)` so the user lands
  on the pre-filled edit form to complete/correct it. This replaces the old
  Telegram "ask a clarifying question and hope the reply links back" flow
  with an immediate, synchronous fix-it-now interaction.
- Duplicate detection: before saving, check the same way `/api/expenses`
  already does — same title (case-insensitive) + same amount + same date
  among existing `paidExpenses` — and if found, show "Already added" instead
  of creating a second record.
- A "not a receipt" result (`is_expense: false` with a clear
  `non_expense_reason` like "selfie" or "scenery photo") is shown as a
  skipped status row with the reason — nothing is added.

## Data flow / state

No new state persistence layer. `paidExpenses` continues to live in
`localStorage` via the existing `useLocalStorage` hook, updated through the
existing functional-updater pattern (`setPaidExpenses(prev => ...)`) that was
already fixed for the stale-closure bug. The new upload panel is purely an
additional producer of `ExpenseRecord`s into that same state, using the same
`openEditModal` / `handleSaveForm` machinery the manual entry flow already
has.

## Testing

- Manual verification in the browser: upload a real JPY receipt image →
  confirm it appears in Paid list with correct amount/category within a few
  seconds, no page reload needed.
- Upload a PHP-denominated receipt (or screenshot) → confirm it's stored with
  `currency: "PHP"`, `convertedAmountPHP` set to the original figure, and
  `amount` correctly converted to JPY using the live FX rate.
- Upload a non-receipt image (e.g. a selfie) → confirm it's skipped with a
  clear reason, nothing added.
- Upload an unreadable/blurry receipt → confirm a draft record is created and
  the edit modal opens pre-filled, rather than the upload silently failing.
- Upload the same receipt twice → confirm the second is flagged as already
  added, not duplicated.
- Confirm the existing Telegram/n8n path (`syncExpensesFromAPI`,
  `/api/expenses`) is untouched and still behaves exactly as before.

## Open items for future specs (not this one)

- Credit-card FX-markup adjustment: a way to later enter the *actual* PHP
  amount that appeared on a card statement (which can differ from the naive
  FX-converted estimate due to card issuer rates/fees) and have it override
  `convertedAmountPHP` for that record.
- PDF receipt support, if wanted later.
