import { NextResponse } from "next/server";
import { ExpenseRecord } from "../../../types/trip";
import fs from "fs";
import path from "path";

const TMP_FILE = path.join("/tmp", "travel_tokyo_expenses.json");

// In-memory global store to share state across requests in the same serverless instance
declare global {
  // eslint-disable-next-line no-var
  var __GLOBAL_TRAVEL_EXPENSES__: ExpenseRecord[] | undefined;
}

if (!globalThis.__GLOBAL_TRAVEL_EXPENSES__) {
  globalThis.__GLOBAL_TRAVEL_EXPENSES__ = [];
}

// Helper to read expenses
function readExpenses(): ExpenseRecord[] {
  try {
    if (globalThis.__GLOBAL_TRAVEL_EXPENSES__ && globalThis.__GLOBAL_TRAVEL_EXPENSES__.length > 0) {
      return globalThis.__GLOBAL_TRAVEL_EXPENSES__;
    }
    if (fs.existsSync(TMP_FILE)) {
      const data = fs.readFileSync(TMP_FILE, "utf-8");
      const parsed = JSON.parse(data);
      globalThis.__GLOBAL_TRAVEL_EXPENSES__ = parsed;
      return parsed;
    }
  } catch (e) {
    console.error("Error reading expenses:", e);
  }
  return globalThis.__GLOBAL_TRAVEL_EXPENSES__ || [];
}

// Helper to save expenses
function saveExpenses(expenses: ExpenseRecord[]) {
  try {
    globalThis.__GLOBAL_TRAVEL_EXPENSES__ = expenses;
    fs.writeFileSync(TMP_FILE, JSON.stringify(expenses, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving expenses:", e);
  }
}

// CORS Headers — scoped to this site's own domain rather than "*". This endpoint
// still has no auth token, so it's not appropriate for a public commercial template,
// but for this personal deployment it at least stops arbitrary third-party web pages
// from reading/writing expense data via a visitor's browser. It does not affect the
// n8n/Telegram sync, since that calls this endpoint server-to-server (not subject to
// browser CORS at all).
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://traveltokyo.workflowlab.site",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET /api/expenses - returns all synced expenses sorted by date descending (latest first)
export async function GET() {
  const expenses = readExpenses();
  const sorted = [...expenses].sort((a, b) => {
    const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
    return diff !== 0 ? diff : b.id.localeCompare(a.id);
  });

  return NextResponse.json(
    {
      success: true,
      expenses: sorted,
      count: sorted.length,
    },
    { headers: corsHeaders }
  );
}

// POST /api/expenses - receives a new expense from n8n / Telegram
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.amount) {
      return NextResponse.json(
        { success: false, error: "Title and amount are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const currentExpenses = readExpenses();

    const fxRate = 2.70;
    const amountJPY = parseInt(body.amount, 10) || 0;
    const amountPHP = body.convertedAmountPHP || Math.round(amountJPY / fxRate);

    const newExpense: ExpenseRecord = {
      id: body.id || `tg-${Date.now()}`,
      title: String(body.title).trim(),
      amount: amountJPY,
      currency: "JPY",
      category: body.category || "food",
      paymentMethod: body.paymentMethod || "Cash",
      date: body.date || new Date().toISOString().split("T")[0],
      status: "paid",
      notes: body.notes || "Auto-synced via Telegram Bot",
    };

    // Deduplication check
    const existingIndex = currentExpenses.findIndex(
      (e) =>
        e.id === newExpense.id ||
        (e.title.toLowerCase() === newExpense.title.toLowerCase() &&
          e.amount === newExpense.amount &&
          e.date === newExpense.date)
    );

    if (existingIndex >= 0) {
      return NextResponse.json(
        {
          success: true,
          message: "Expense already exists (duplicate avoided)",
          expense: currentExpenses[existingIndex],
          duplicate: true,
        },
        { headers: corsHeaders }
      );
    }

    // Add to list, sort newest first, and persist
    const updated = [newExpense, ...currentExpenses];
    saveExpenses(updated);

    return NextResponse.json(
      {
        success: true,
        message: "Expense successfully recorded on TravelTokyo",
        expense: newExpense,
        totalPaidCount: updated.length,
        chatId: body.chatId,
        title: newExpense.title,
        amount: newExpense.amount,
        category: newExpense.category,
        paymentMethod: newExpense.paymentMethod,
        date: newExpense.date,
        notes: newExpense.notes,
        convertedAmountPHP: amountPHP,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process expense";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE /api/expenses - deletes an expense by id
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const current = readExpenses();
    const updated = current.filter((e) => e.id !== id);
    saveExpenses(updated);

    return NextResponse.json({ success: true, count: updated.length }, { headers: corsHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete expense";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500, headers: corsHeaders }
    );
  }
}
