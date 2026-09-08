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
