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
