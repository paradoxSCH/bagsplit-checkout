"use client";

import { useMemo, useState } from "react";

import { createCheckoutInputSchema, type CreateCheckoutInput } from "@/lib/checkout";

const initialForm: CreateCheckoutInput = {
  creatorWallet: "BagSplitCreator111111111111111111111111111",
  creatorProjectName: "BagSplit Studio",
  title: "Creator Launch Room Pass",
  description: "Private updates, launch notes, and member drops for early supporters.",
  priceAmount: 24,
  priceTokenMint: "BSPAYMint111111111111111111111111111111",
  priceTokenSymbol: "BSPAY",
  deliveryType: "membership",
  inventoryLimit: 100,
  expiresAt: null,
};

export function CreateCheckoutForm() {
  const [form, setForm] = useState<CreateCheckoutInput>(initialForm);
  const [createdPath, setCreatedPath] = useState("/checkout/creator-pass");

  const validation = useMemo(() => createCheckoutInputSchema.safeParse(form), [form]);
  const canSubmit = validation.success;

  function updateField<Key extends keyof CreateCheckoutInput>(key: Key, value: CreateCheckoutInput[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    const slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setCreatedPath(`/checkout/${slug || "creator-pass"}`);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="grid gap-2">
        <label htmlFor="title" className="text-sm font-medium text-stone-800">
          Checkout title
        </label>
        <input
          id="title"
          value={form.title}
          onChange={(event) => updateField("title", event.target.value)}
          className="h-11 rounded-md border border-stone-300 px-3 text-sm outline-none focus:border-stone-900"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="description" className="text-sm font-medium text-stone-800">
          Description
        </label>
        <textarea
          id="description"
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
          rows={4}
          className="rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-900"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <label htmlFor="price" className="text-sm font-medium text-stone-800">
            Price
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={form.priceAmount}
            onChange={(event) => updateField("priceAmount", Number(event.target.value))}
            className="h-11 rounded-md border border-stone-300 px-3 text-sm outline-none focus:border-stone-900"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="symbol" className="text-sm font-medium text-stone-800">
            Token
          </label>
          <input
            id="symbol"
            value={form.priceTokenSymbol}
            onChange={(event) => updateField("priceTokenSymbol", event.target.value.toUpperCase())}
            className="h-11 rounded-md border border-stone-300 px-3 text-sm outline-none focus:border-stone-900"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="inventory" className="text-sm font-medium text-stone-800">
            Inventory
          </label>
          <input
            id="inventory"
            type="number"
            min="1"
            value={form.inventoryLimit ?? ""}
            onChange={(event) => updateField("inventoryLimit", event.target.value ? Number(event.target.value) : null)}
            className="h-11 rounded-md border border-stone-300 px-3 text-sm outline-none focus:border-stone-900"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="delivery" className="text-sm font-medium text-stone-800">
          Delivery type
        </label>
        <select
          id="delivery"
          value={form.deliveryType}
          onChange={(event) => updateField("deliveryType", event.target.value as CreateCheckoutInput["deliveryType"])}
          className="h-11 rounded-md border border-stone-300 px-3 text-sm outline-none focus:border-stone-900"
        >
          <option value="download">Download</option>
          <option value="membership">Membership</option>
          <option value="event">Event</option>
          <option value="service">Service</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {!validation.success ? (
        <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Complete the title, description, token, and a positive price before publishing.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="h-11 rounded-md bg-stone-950 px-5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
          disabled={!canSubmit}
        >
          Create mock checkout
        </button>
        <a href={createdPath} className="text-sm font-medium text-stone-900 underline underline-offset-4">
          Open generated checkout
        </a>
      </div>
    </form>
  );
}