# Website Receipt Upload (AI-Categorized) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the user upload receipt images (or type a note) directly on the Budget page, have Google Gemini extract the expense details, and auto-save the result into the same local-storage-backed expense list the manual "Add Expense" form already uses — with low-confidence results immediately opening the existing edit form instead of getting stuck or lost.

**Architecture:** A new pure logic module (`src/lib/receiptExpense.ts`) holds all the prompt-building, AI-response-parsing, currency-conversion, and duplicate-detection logic, fully unit-testable without a network call. A new stateless API route (`src/app/api/parse-receipt/route.ts`) uses that module to call Gemini server-side (API key never reaches the browser) and classifies the result as `add` / `review` / `skip`. A new client component (`src/components/ReceiptUpload.tsx`) uploads files/text to that route one at a time, and — using the same module — builds an `ExpenseRecord` and saves it via the Budget page's existing `setPaidExpenses`/`openEditModal`.

**Tech Stack:** Next.js App Router API routes, React (client component), Google Gemini `generateContent` REST API (`gemini-3.6-flash`), Node's native TypeScript support for standalone logic tests (no test framework is installed in this repo).

**Spec:** [docs/superpowers/specs/2026-09-08-website-receipt-upload-design.md](../specs/2026-09-08-website-receipt-upload-design.md)

## Global Constraints

- Do not modify the Telegram/n8n code path: `syncExpensesFromAPI` / the 8s polling `useEffect` in `src/app/budget/page.tsx`, or anything in `src/app/api/expenses/route.ts`. Leave it exactly as-is (explicit user instruction).
- No new server-side persistent storage. Expenses created by this feature save into the same `localStorage`-backed `paidExpenses` state the manual "Add Expense" form uses — nothing server-side is written except the stateless Gemini call.
- The Gemini API key (`GEMINI_API_KEY`) must only ever be read server-side (inside the API route, from `process.env`). Never pass it to the client or log it.
- Amount is always stored canonically in JPY on `ExpenseRecord.amount`; when the source was PHP, `convertedAmountPHP` holds the original PHP figure and `currency` is `"PHP"` — this exactly mirrors the existing `handleSaveForm` logic in `src/app/budget/page.tsx` and must not diverge from it.
- This repo has no test framework (no Jest/Vitest). Pure logic is tested with a plain Node script (following the existing `scripts/test-persistence.mjs` convention), run directly via `node`, relying on Node's native TypeScript support (Node v26 already in use) via files that only use `import type` for cross-file type references so they're importable standalone.

---

### Task 1: Pure receipt-parsing/expense-building logic module

**Files:**
- Create: `src/lib/receiptExpense.ts`
- Create: `scripts/test-receipt-expense.mjs`
- Modify: `package.json` (add a `test:receipt-expense` script)

**Interfaces:**
- Consumes: `ExpenseCategory`, `PaymentMethod`, `ExpenseRecord` types from `src/types/trip.ts` (type-only import — must not be a value import, so this file stays importable by a plain Node script without a bundler).
- Produces (used by Task 2 and Task 3):
  - `export interface ParsedReceipt { is_expense?: boolean; non_expense_reason?: string; title?: string; amount?: number; currency?: string; category?: string; paymentMethod?: string; date?: string; notes?: string; }`
  - `export const PARSE_FAILURE_REASON: string`
  - `export function buildReceiptPrompt(input: { kind: "image" | "text"; caption?: string; text?: string }): string`
  - `export function extractJsonFromGeminiResponse(raw: unknown): ParsedReceipt`
  - `export type ReceiptAction = "add" | "review" | "skip"`
  - `export function classifyParsedReceipt(parsed: ParsedReceipt): ReceiptAction`
  - `export function computeExpenseAmounts(rawAmount: number, sourceCurrency: string | undefined, fxRate: number): { amount: number; currency: "JPY" | "PHP"; convertedAmountPHP?: number }`
  - `export function buildExpenseRecordFromParsedReceipt(parsed: ParsedReceipt, fxRate: number, opts: { id: string; todayDate: string }): ExpenseRecord`
  - `export function isDuplicateExpense(existing: ExpenseRecord[], candidate: Pick<ExpenseRecord, "title" | "amount" | "date">): boolean`

- [ ] **Step 1: Write the failing test script**

Create `scripts/test-receipt-expense.mjs`:

```js
import assert from "node:assert";
import {
  buildReceiptPrompt,
  extractJsonFromGeminiResponse,
  classifyParsedReceipt,
  computeExpenseAmounts,
  buildExpenseRecordFromParsedReceipt,
  isDuplicateExpense,
  PARSE_FAILURE_REASON,
} from "../src/lib/receiptExpense.ts";

console.log("🧪 Starting Receipt Expense Logic Tests...\n");

// 1. buildReceiptPrompt
{
  const prompt = buildReceiptPrompt({ kind: "image", caption: "ramen" });
  assert.ok(prompt.includes("'PHP' if"), "prompt must mention PHP handling");
  assert.ok(prompt.includes("ramen"), "prompt must include the caption");
  assert.ok(!prompt.includes("needs_clarification"), "prompt must not reintroduce the old clarification flow");
  console.log("✅ 1. buildReceiptPrompt includes PHP guidance and the caption");
}

// 2. extractJsonFromGeminiResponse - success case (with markdown code fence, as Gemini often returns)
{
  const fakeResponse = {
    candidates: [{ content: { parts: [{ text: '```json\n{"is_expense":true,"amount":1800}\n```' }] } }],
  };
  const parsed = extractJsonFromGeminiResponse(fakeResponse);
  assert.strictEqual(parsed.is_expense, true);
  assert.strictEqual(parsed.amount, 1800);
  console.log("✅ 2. extractJsonFromGeminiResponse strips code fences and parses JSON");
}

// 3. extractJsonFromGeminiResponse - malformed case
{
  const fakeResponse = { candidates: [{ content: { parts: [{ text: "not json at all" }] } }] };
  const parsed = extractJsonFromGeminiResponse(fakeResponse);
  assert.strictEqual(parsed.is_expense, false);
  assert.strictEqual(parsed.non_expense_reason, PARSE_FAILURE_REASON);
  console.log("✅ 3. extractJsonFromGeminiResponse falls back safely on malformed output");
}

// 4. classifyParsedReceipt
{
  assert.strictEqual(classifyParsedReceipt({ is_expense: true, amount: 1800 }), "add");
  assert.strictEqual(classifyParsedReceipt({ is_expense: true, amount: 0 }), "review");
  assert.strictEqual(classifyParsedReceipt({ is_expense: true }), "review");
  assert.strictEqual(classifyParsedReceipt({ is_expense: false, non_expense_reason: "Selfie" }), "skip");
  assert.strictEqual(classifyParsedReceipt({ is_expense: false, non_expense_reason: PARSE_FAILURE_REASON }), "review");
  assert.strictEqual(classifyParsedReceipt({ is_expense: false }), "review");
  console.log("✅ 4. classifyParsedReceipt decides add / review / skip correctly");
}

// 5. computeExpenseAmounts - the exact PHP-handling bug fixed in the n8n workflow this session
{
  const jpyResult = computeExpenseAmounts(1800, "JPY", 2.70);
  assert.strictEqual(jpyResult.amount, 1800);
  assert.strictEqual(jpyResult.currency, "JPY");
  assert.strictEqual(jpyResult.convertedAmountPHP, undefined);

  const phpResult = computeExpenseAmounts(875, "PHP", 2.70);
  assert.strictEqual(phpResult.amount, Math.round(875 * 2.70));
  assert.strictEqual(phpResult.currency, "PHP");
  assert.strictEqual(phpResult.convertedAmountPHP, 875);
  console.log("✅ 5. computeExpenseAmounts converts PHP receipts to JPY instead of rejecting them");
}

// 6. buildExpenseRecordFromParsedReceipt - safe defaults for a low-confidence draft
{
  const record = buildExpenseRecordFromParsedReceipt(
    { is_expense: true, amount: 0, title: "" },
    2.70,
    { id: "receipt-test-1", todayDate: "2026-09-08" }
  );
  assert.strictEqual(record.id, "receipt-test-1");
  assert.strictEqual(record.amount, 0);
  assert.strictEqual(record.title, "Uploaded Receipt");
  assert.strictEqual(record.category, "other");
  assert.strictEqual(record.paymentMethod, "Cash");
  assert.strictEqual(record.date, "2026-09-08");
  assert.strictEqual(record.status, "paid");
  console.log("✅ 6. buildExpenseRecordFromParsedReceipt fills safe defaults for incomplete drafts");
}

// 7. buildExpenseRecordFromParsedReceipt - confident PHP receipt end-to-end
{
  const record = buildExpenseRecordFromParsedReceipt(
    { is_expense: true, amount: 875, currency: "PHP", title: "Foodcrave Marketing", category: "food", paymentMethod: "RCBC Visa", date: "2026-09-07" },
    2.70,
    { id: "receipt-test-2", todayDate: "2026-09-08" }
  );
  assert.strictEqual(record.amount, Math.round(875 * 2.70));
  assert.strictEqual(record.currency, "PHP");
  assert.strictEqual(record.convertedAmountPHP, 875);
  assert.strictEqual(record.date, "2026-09-07");
  console.log("✅ 7. buildExpenseRecordFromParsedReceipt handles a confident PHP receipt end-to-end");
}

// 8. isDuplicateExpense
{
  const existing = [
    {
      id: "1",
      title: "Ichiran Ramen",
      amount: 1800,
      currency: "JPY",
      category: "food",
      paymentMethod: "Cash",
      date: "2026-09-08",
      status: "paid",
    },
  ];
  assert.strictEqual(
    isDuplicateExpense(existing, { title: "ichiran ramen", amount: 1800, date: "2026-09-08" }),
    true
  );
  assert.strictEqual(
    isDuplicateExpense(existing, { title: "Ichiran Ramen", amount: 1900, date: "2026-09-08" }),
    false
  );
  console.log("✅ 8. isDuplicateExpense matches case-insensitively on title+amount+date");
}

console.log("\n🎉 All receipt expense logic tests passed.");
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `node scripts/test-receipt-expense.mjs`
Expected: FAIL — `Cannot find module '.../src/lib/receiptExpense.ts'` (the module doesn't exist yet).

- [ ] **Step 3: Implement `src/lib/receiptExpense.ts`**

```ts
import type { ExpenseCategory, ExpenseRecord, PaymentMethod } from "../types/trip";

export interface ParsedReceipt {
  is_expense?: boolean;
  non_expense_reason?: string;
  title?: string;
  amount?: number;
  currency?: string;
  category?: string;
  paymentMethod?: string;
  date?: string;
  notes?: string;
}

export const PARSE_FAILURE_REASON = "Could not parse AI output format.";

const VALID_CATEGORIES: ExpenseCategory[] = [
  "hotel",
  "flights",
  "food",
  "transport",
  "shopping",
  "tickets",
  "documents",
  "other",
];

const VALID_PAYMENT_METHODS: string[] = [
  "Cash",
  "BDO JCB",
  "BDO Mastercard",
  "RCBC Visa",
  "GCash",
  "MariBank",
  "UnionBank Visa",
  "Other Card / Wallet",
];

export function buildReceiptPrompt(input: {
  kind: "image" | "text";
  caption?: string;
  text?: string;
}): string {
  const context =
    input.kind === "image"
      ? `Analyze this image and user caption: '${input.caption || ""}'.`
      : `Analyze this text message: '${input.text || ""}'.`;

  return `You are the TravelTokyo AI Expense Parser for a 7-day Tokyo trip.
${context}

TASK 1: Determine if this is an actual monetary receipt / paid transaction OR a non-expense item (scenery photo, selfie, general chat, travel document without price).
TASK 2: If it is an expense, extract all transaction details.

Output strictly valid JSON matching this schema:
{
  "is_expense": boolean,
  "non_expense_reason": string (e.g. 'Scenery photo', 'Selfie', 'No price shown'),
  "title": string (Merchant name / item description),
  "amount": number (Total amount exactly as shown, in its ORIGINAL currency — do not convert it yourself),
  "currency": string (The currency actually shown: 'JPY' if ¥ or unspecified, 'PHP' if ₱ or 'Peso'/'PHP' is shown),
  "category": string (Must be ONE of: 'food', 'transport', 'shopping', 'tickets', 'hotel', 'flights', 'documents', 'other'),
  "paymentMethod": string (Must be ONE of: 'Cash', 'BDO JCB', 'BDO Mastercard', 'RCBC Visa', 'GCash', 'MariBank', 'UnionBank Visa', 'Other Card / Wallet'),
  "date": string (YYYY-MM-DD format),
  "notes": string
}

Payment Methods:
- cash / '現金' -> 'Cash'
- JCB -> 'BDO JCB'
- Mastercard / MC -> 'BDO Mastercard'
- VISA -> 'RCBC Visa'
- GCash -> 'GCash'
- MariBank -> 'MariBank'
- UnionBank -> 'UnionBank Visa'
- Default to 'Cash' if unstated.

Never fabricate unreadable totals. A PHP-denominated transaction is a valid expense; extract it normally with currency='PHP' — never set is_expense=false just because the currency is PHP instead of JPY. Only set is_expense=false for things that truly aren't a paid transaction (scenery, selfies, casual chat, documents with no price).`;
}

export function extractJsonFromGeminiResponse(raw: unknown): ParsedReceipt {
  let rawText = "{}";
  const res = raw as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
    text?: string;
  };

  if (res?.candidates?.[0]?.content?.parts?.[0]?.text) {
    rawText = res.candidates[0].content.parts[0].text as string;
  } else if (typeof res?.text === "string") {
    rawText = res.text;
  }

  try {
    const clean = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(clean) as ParsedReceipt;
  } catch {
    return { is_expense: false, non_expense_reason: PARSE_FAILURE_REASON };
  }
}

export type ReceiptAction = "add" | "review" | "skip";

export function classifyParsedReceipt(parsed: ParsedReceipt): ReceiptAction {
  const amount = typeof parsed.amount === "number" ? parsed.amount : Number(parsed.amount);
  const hasValidAmount = Number.isFinite(amount) && amount > 0;

  if (parsed.is_expense === false) {
    const reason = (parsed.non_expense_reason || "").trim();
    if (reason.length > 0 && reason !== PARSE_FAILURE_REASON) {
      return "skip";
    }
    return "review";
  }

  return hasValidAmount ? "add" : "review";
}

export function computeExpenseAmounts(
  rawAmount: number,
  sourceCurrency: string | undefined,
  fxRate: number
): { amount: number; currency: "JPY" | "PHP"; convertedAmountPHP?: number } {
  const isPHP = (sourceCurrency || "JPY").toUpperCase() === "PHP";
  if (isPHP) {
    return {
      amount: Math.round(rawAmount * fxRate),
      currency: "PHP",
      convertedAmountPHP: rawAmount,
    };
  }
  return {
    amount: rawAmount,
    currency: "JPY",
    convertedAmountPHP: undefined,
  };
}

export function buildExpenseRecordFromParsedReceipt(
  parsed: ParsedReceipt,
  fxRate: number,
  opts: { id: string; todayDate: string }
): ExpenseRecord {
  const rawAmount = typeof parsed.amount === "number" ? parsed.amount : Number(parsed.amount) || 0;
  const { amount, currency, convertedAmountPHP } = computeExpenseAmounts(
    rawAmount,
    parsed.currency,
    fxRate
  );

  const category = VALID_CATEGORIES.includes(parsed.category as ExpenseCategory)
    ? (parsed.category as ExpenseCategory)
    : "other";
  const paymentMethod = (
    VALID_PAYMENT_METHODS.includes(parsed.paymentMethod || "") ? parsed.paymentMethod : "Cash"
  ) as PaymentMethod;

  return {
    id: opts.id,
    title: (parsed.title || "").trim() || "Uploaded Receipt",
    amount,
    currency,
    convertedAmountPHP,
    category,
    paymentMethod,
    date: parsed.date || opts.todayDate,
    status: "paid",
    notes: parsed.notes?.trim() || "Added via website receipt upload",
  };
}

export function isDuplicateExpense(
  existing: ExpenseRecord[],
  candidate: Pick<ExpenseRecord, "title" | "amount" | "date">
): boolean {
  return existing.some(
    (e) =>
      e.title.toLowerCase() === candidate.title.toLowerCase() &&
      e.amount === candidate.amount &&
      e.date === candidate.date
  );
}
```

- [ ] **Step 4: Run the test script again to confirm it passes**

Run: `node scripts/test-receipt-expense.mjs`
Expected: all 8 checks print ✅ and the script ends with `🎉 All receipt expense logic tests passed.`

- [ ] **Step 5: Add an npm script for discoverability**

In `package.json`, add to `"scripts"`:

```json
"test:receipt-expense": "node scripts/test-receipt-expense.mjs"
```

Run `npm run test:receipt-expense` to confirm it still passes through the new script alias.

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors introduced by `src/lib/receiptExpense.ts`.

- [ ] **Step 7: Commit**

```bash
git add src/lib/receiptExpense.ts scripts/test-receipt-expense.mjs package.json
git commit -m "feat(budget): add pure receipt-parsing/expense-building logic with tests"
```

---

### Task 2: `/api/parse-receipt` API route

**Files:**
- Create: `src/app/api/parse-receipt/route.ts`
- Create: `.env.example`
- Modify: `.gitignore` (allow `.env.example` to be committed despite the `.env*` ignore rule)

**Interfaces:**
- Consumes: `buildReceiptPrompt`, `extractJsonFromGeminiResponse`, `classifyParsedReceipt` from `src/lib/receiptExpense.ts` (Task 1).
- Produces (used by Task 3): `POST /api/parse-receipt` accepting JSON body `{ imageBase64?: string; mimeType?: string; text?: string; caption?: string }` (provide either `imageBase64`+`mimeType`, or `text`), returning `{ success: true; action: "add" | "review" | "skip"; parsed: ParsedReceipt } | { success: false; error: string }`.

- [ ] **Step 1: Add the env var placeholder and allow it to be committed**

Create `.env.example`:

```
# Server-side only — used by src/app/api/parse-receipt/route.ts to call Google Gemini.
# Get a key at https://aistudio.google.com/apikey
GEMINI_API_KEY=
```

In `.gitignore`, change:

```
# env files (can opt-in for committing if needed)
.env*
```

to:

```
# env files (can opt-in for committing if needed)
.env*
!.env.example
```

- [ ] **Step 2: Implement the route**

Create `src/app/api/parse-receipt/route.ts`:

```ts
import { NextResponse } from "next/server";
import {
  buildReceiptPrompt,
  classifyParsedReceipt,
  extractJsonFromGeminiResponse,
} from "../../../lib/receiptExpense";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";

interface ParseReceiptRequestBody {
  imageBase64?: string;
  mimeType?: string;
  text?: string;
  caption?: string;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "GEMINI_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  let body: ParseReceiptRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const hasImage = typeof body.imageBase64 === "string" && body.imageBase64.length > 0;
  const hasText = typeof body.text === "string" && body.text.trim().length > 0;
  if (!hasImage && !hasText) {
    return NextResponse.json(
      { success: false, error: "Provide either imageBase64 (with mimeType) or text" },
      { status: 400 }
    );
  }

  const prompt = buildReceiptPrompt(
    hasImage ? { kind: "image", caption: body.caption } : { kind: "text", text: body.text }
  );

  const parts: Record<string, unknown>[] = [{ text: prompt }];
  if (hasImage) {
    parts.push({
      inlineData: { mimeType: body.mimeType || "image/jpeg", data: body.imageBase64 },
    });
  }

  const geminiPayload = {
    contents: [{ parts }],
    generationConfig: { temperature: 0.1, responseMimeType: "application/json" },
  };

  let geminiRes: Response;
  try {
    geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify(geminiPayload),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error calling Gemini";
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }

  if (!geminiRes.ok) {
    const errorText = await geminiRes.text().catch(() => "");
    return NextResponse.json(
      { success: false, error: `Gemini API returned ${geminiRes.status}: ${errorText.slice(0, 300)}` },
      { status: 502 }
    );
  }

  const geminiJson = await geminiRes.json();
  const parsed = extractJsonFromGeminiResponse(geminiJson);
  const action = classifyParsedReceipt(parsed);

  return NextResponse.json({ success: true, action, parsed });
}
```

- [ ] **Step 3: Start the dev server**

Use the `travel-tokyo-dev` preview configuration (`.claude/launch.json`, port 3000) to start `npm run dev`.

- [ ] **Step 4: Verify the pre-Gemini-call error paths (no API key needed for these)**

With `GEMINI_API_KEY` unset (the default — nothing has configured it yet):

```bash
curl -s -X POST http://localhost:3000/api/parse-receipt -H "Content-Type: application/json" -d '{"text":"ramen 1500 cash"}'
```

Expected: `{"success":false,"error":"GEMINI_API_KEY is not configured on the server."}`

```bash
curl -s -X POST http://localhost:3000/api/parse-receipt -H "Content-Type: application/json" -d '{}'
```

Expected (still without a key, this returns the missing-key error first — that's fine, it's checked first). Set a throwaway placeholder to check the next validation layer:

```bash
GEMINI_API_KEY=placeholder npm run dev &
sleep 2
curl -s -X POST http://localhost:3000/api/parse-receipt -H "Content-Type: application/json" -d '{}'
```

Expected: `{"success":false,"error":"Provide either imageBase64 (with mimeType) or text"}`

(Stop that throwaway server afterward; the real dev server for Task 3 will be started fresh via the preview tool.)

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/parse-receipt/route.ts .env.example .gitignore
git commit -m "feat(budget): add /api/parse-receipt route calling Gemini server-side"
```

---

### Task 3: `ReceiptUpload` component + Budget page wiring

**Files:**
- Create: `src/components/ReceiptUpload.tsx`
- Modify: `src/app/budget/page.tsx` (import and render the component; no changes to existing Telegram-sync code)

**Interfaces:**
- Consumes: `computeExpenseAmounts` is not used directly here (it's used inside `buildExpenseRecordFromParsedReceipt`); imports `buildExpenseRecordFromParsedReceipt`, `isDuplicateExpense`, `ParsedReceipt`, `ReceiptAction` from `src/lib/receiptExpense.ts` (Task 1). Calls `POST /api/parse-receipt` (Task 2).
- Produces: React component `ReceiptUpload` with props:

```ts
interface ReceiptUploadProps {
  paidExpenses: ExpenseRecord[];
  setPaidExpenses: (value: ExpenseRecord[] | ((prev: ExpenseRecord[]) => ExpenseRecord[])) => void;
  fxRate: number;
  openEditModal: (item: ExpenseRecord) => void;
}
```

This matches the exact signature of `setPaidExpenses` from `useLocalStorage` and `openEditModal` already defined in `src/app/budget/page.tsx:467`.

- [ ] **Step 1: Implement the component**

Create `src/components/ReceiptUpload.tsx`:

```tsx
"use client";

import { useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, ImagePlus, Loader2, RefreshCw, Upload } from "lucide-react";
import { ExpenseRecord } from "../types/trip";
import { buildExpenseRecordFromParsedReceipt, isDuplicateExpense, ParsedReceipt, ReceiptAction } from "../lib/receiptExpense";

interface ReceiptUploadProps {
  paidExpenses: ExpenseRecord[];
  setPaidExpenses: (value: ExpenseRecord[] | ((prev: ExpenseRecord[]) => ExpenseRecord[])) => void;
  fxRate: number;
  openEditModal: (item: ExpenseRecord) => void;
}

type QueueStatus = "processing" | "added" | "review" | "skipped" | "error";
type QueueSource = { kind: "image"; file: File } | { kind: "text"; text: string };

interface QueueItem {
  id: string;
  label: string;
  status: QueueStatus;
  message?: string;
  source: QueueSource;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] || "");
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ReceiptUpload({ paidExpenses, setPaidExpenses, fxRate, openEditModal }: ReceiptUploadProps) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [textInput, setTextInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const paidExpensesRef = useRef(paidExpenses);
  paidExpensesRef.current = paidExpenses;

  const updateQueueItem = (id: string, patch: Partial<QueueItem>) => {
    setQueue((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  };

  const handleResult = (
    queueId: string,
    result: { success: true; action: ReceiptAction; parsed: ParsedReceipt } | { success: false; error: string }
  ) => {
    if (!result.success) {
      updateQueueItem(queueId, { status: "error", message: result.error });
      return;
    }

    if (result.action === "skip") {
      updateQueueItem(queueId, {
        status: "skipped",
        message: result.parsed.non_expense_reason || "Not a receipt",
      });
      return;
    }

    const record = buildExpenseRecordFromParsedReceipt(result.parsed, fxRate, {
      id: `receipt-${Date.now()}-${Math.round(Math.random() * 1e6)}`,
      todayDate: new Date().toISOString().split("T")[0],
    });

    if (isDuplicateExpense(paidExpensesRef.current, record)) {
      updateQueueItem(queueId, { status: "skipped", message: "Already added" });
      return;
    }

    setPaidExpenses((prev) => [record, ...prev]);

    if (result.action === "review") {
      updateQueueItem(queueId, { status: "review", message: "Needs review — opening editor" });
      openEditModal(record);
    } else {
      const amountLabel =
        record.currency === "PHP" && record.convertedAmountPHP !== undefined
          ? `₱${record.convertedAmountPHP.toLocaleString()}`
          : `¥${record.amount.toLocaleString()}`;
      updateQueueItem(queueId, { status: "added", message: `${record.title} — ${amountLabel}` });
    }
  };

  const processImage = async (queueId: string, file: File) => {
    updateQueueItem(queueId, { status: "processing" });
    try {
      const imageBase64 = await fileToBase64(file);
      const res = await fetch("/api/parse-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, mimeType: file.type || "image/jpeg" }),
      });
      const json = await res.json();
      handleResult(queueId, json);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      updateQueueItem(queueId, { status: "error", message });
    }
  };

  const processText = async (queueId: string, text: string) => {
    updateQueueItem(queueId, { status: "processing" });
    try {
      const res = await fetch("/api/parse-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const json = await res.json();
      handleResult(queueId, json);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      updateQueueItem(queueId, { status: "error", message });
    }
  };

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const items: QueueItem[] = Array.from(files).map((file, i) => ({
      id: `${Date.now()}-${i}`,
      label: file.name,
      status: "processing" as const,
      source: { kind: "image" as const, file },
    }));
    setQueue((prev) => [...items, ...prev]);

    for (let i = 0; i < files.length; i++) {
      await processImage(items[i].id, files[i]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleTextSubmit = async () => {
    const text = textInput.trim();
    if (!text) return;
    const id = `${Date.now()}-text`;
    setQueue((prev) => [
      { id, label: text, status: "processing" as const, source: { kind: "text" as const, text } },
      ...prev,
    ]);
    setTextInput("");
    await processText(id, text);
  };

  const retryItem = (item: QueueItem) => {
    if (item.source.kind === "image") {
      processImage(item.id, item.source.file);
    } else {
      processText(item.id, item.source.text);
    }
  };

  const statusIcon = (status: QueueStatus) => {
    switch (status) {
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-stone-400" />;
      case "added":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case "review":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case "skipped":
        return <AlertTriangle className="h-4 w-4 text-stone-400" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-md space-y-4">
      <div className="flex items-center gap-2">
        <ImagePlus className="h-4 w-4 text-[#1F3A5F]" />
        <h3 className="font-serif text-sm font-bold text-stone-900">Upload Receipt (AI)</h3>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          id="receipt-file-input"
          onChange={(e) => handleFilesSelected(e.target.files)}
        />
        <label
          htmlFor="receipt-file-input"
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#1F3A5F] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-[#132540] transition"
        >
          <Upload className="h-4 w-4 text-[#FFD66B]" />
          <span>Upload Photo(s)</span>
        </label>

        <div className="flex flex-1 min-w-[200px] items-center gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTextSubmit();
            }}
            placeholder="Or type: ramen 1500 cash"
            className="flex-1 rounded-xl border border-stone-300 px-3 py-2 text-xs"
          />
          <button
            onClick={handleTextSubmit}
            className="rounded-xl border border-stone-300 px-3 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50"
          >
            Add
          </button>
        </div>
      </div>

      {queue.length > 0 && (
        <ul className="space-y-2">
          {queue.map((item) => (
            <li key={item.id} className="flex items-center gap-2 text-xs text-stone-700">
              {statusIcon(item.status)}
              <span className="truncate">{item.label}</span>
              {item.message && <span className="text-stone-400">— {item.message}</span>}
              {item.status === "error" && (
                <button
                  onClick={() => retryItem(item)}
                  className="ml-auto inline-flex items-center gap-1 text-[#1F3A5F] hover:underline"
                >
                  <RefreshCw className="h-3 w-3" /> Retry
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Wire it into the Budget page**

In `src/app/budget/page.tsx`, add the import near the other component imports (after the `Navigation` import around line 6):

```tsx
import { ReceiptUpload } from "../../components/ReceiptUpload";
```

Then render it just above the "Paid Expenses List" comment block (before line 1046's `{/* Paid Expenses List */}`), right after the "Action Header Buttons" section closes:

```tsx
<ReceiptUpload
  paidExpenses={paidExpenses}
  setPaidExpenses={setPaidExpenses}
  fxRate={fxRate}
  openEditModal={openEditModal}
/>

{/* Paid Expenses List */}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: no new warnings/errors beyond the pre-existing baseline.

- [ ] **Step 5: Manual browser verification**

Start the `travel-tokyo-dev` preview server and navigate to `/budget`.

Verify (all of this works without a real `GEMINI_API_KEY`, since it only exercises the UI → API wiring up to the point Gemini would be called):
- The "Upload Receipt (AI)" panel renders above the Paid Expenses list, below the "+ Add Paid Expense" row.
- Selecting an image file shows a queue row with a spinner, then flips to an error row reading "GEMINI_API_KEY is not configured on the server." (proves the full client → API round trip works).
- Typing text into the note field and clicking "Add" (or pressing Enter) behaves the same way.
- No console errors unrelated to the expected missing-key error.

Note for the user: a full end-to-end check (an actual receipt image producing a real extracted expense) requires a real `GEMINI_API_KEY` in `.env.local`, which only the user can provide — call this out explicitly when reporting completion, and ask them to test one real upload once the key is in place.

- [ ] **Step 6: Commit**

```bash
git add src/components/ReceiptUpload.tsx src/app/budget/page.tsx
git commit -m "feat(budget): add website receipt upload UI with AI auto-categorization"
```
