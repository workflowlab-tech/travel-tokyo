import { NextResponse } from "next/server";
import { ExpenseRecord } from "../../../types/trip";
import fs from "fs";
import path from "path";

// Local storage fallback for Vercel / serverless runtime
const TMP_FILE = path.join("/tmp", "travel_tokyo_expenses.json");

// Helper to read expenses
function readExpenses(): ExpenseRecord[] {
  try {
    if (fs.existsSync(TMP_FILE)) {
      const data = fs.readFileSync(TMP_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading temp expenses file:", e);
  }
  return [];
}

// Helper to save expenses
function saveExpenses(expenses: ExpenseRecord[]) {
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(expenses, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing temp expenses file:", e);
  }
}

// GET /api/expenses - returns all synced expenses from Telegram / n8n
export async function GET() {
  const expenses = readExpenses();
  return NextResponse.json({
    success: true,
    expenses: expenses,
    count: expenses.length,
  });
}

// POST /api/expenses - receives a new expense from n8n / Telegram
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.amount) {
      return NextResponse.json(
        { success: false, error: "Title and amount are required" },
        { status: 400 }
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
      return NextResponse.json({
        success: true,
        message: "Expense already exists (duplicate avoided)",
        expense: currentExpenses[existingIndex],
        duplicate: true,
      });
    }

    // Add to list and save
    const updated = [newExpense, ...currentExpenses];
    saveExpenses(updated);

    return NextResponse.json({
      success: true,
      message: "Expense successfully recorded on TravelTokyo",
      expense: newExpense,
      totalPaidCount: updated.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process expense" },
      { status: 500 }
    );
  }
}

// DELETE /api/expenses - deletes an expense by id
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    const current = readExpenses();
    const updated = current.filter((e) => e.id !== id);
    saveExpenses(updated);

    return NextResponse.json({ success: true, count: updated.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
