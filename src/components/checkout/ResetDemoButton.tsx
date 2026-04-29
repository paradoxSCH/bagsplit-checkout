"use client";

import { useState } from "react";

export function ResetDemoButton() {
  const [status, setStatus] = useState<"idle" | "resetting" | "done" | "error">("idle");

  async function handleReset() {
    setStatus("resetting");

    try {
      const response = await fetch("/api/demo/reset", { method: "POST" });

      if (!response.ok) {
        throw new Error("Demo reset failed.");
      }

      setStatus("done");
      window.location.reload();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleReset}
        disabled={status === "resetting"}
        className="rounded-md border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950 disabled:cursor-not-allowed disabled:text-stone-400"
      >
        {status === "resetting" ? "Resetting..." : "Reset demo data"}
      </button>
      {status === "error" ? <span className="text-sm text-red-700">Reset failed</span> : null}
    </div>
  );
}
