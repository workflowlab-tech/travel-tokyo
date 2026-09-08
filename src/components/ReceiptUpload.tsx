"use client";

import { useEffect, useRef, useState } from "react";
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

// Defined at module scope (not inside the component) so id generation stays out of
// render's purity analysis — these are only ever invoked from event handlers / async
// callbacks, never during render.
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e6)}`;
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
  useEffect(() => {
    paidExpensesRef.current = paidExpenses;
  }, [paidExpenses]);

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
      id: generateId("receipt"),
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
      id: generateId(`image-${i}`),
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
    const id = generateId("text");
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
