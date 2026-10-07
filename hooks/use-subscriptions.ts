"use client";
import { useEffect, useMemo, useState } from "react";
import { monthlyCost } from "@/lib/roast";
import { readSubscriptions, writeSubscriptions } from "@/lib/storage";
import type { Subscription } from "@/lib/types";

export function useSubscriptions() {
  const [items, setItems] = useState<Subscription[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(readSubscriptions());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      writeSubscriptions(items);
    }
  }, [items, ready]);

  const monthlyTotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + monthlyCost(item.price, item.period),
        0,
      ),
    [items],
  );

  function add(item: Subscription) {
    setItems((current) => [item, ...current]);
  }

  function update(id: string, patch: Partial<Subscription>) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function remove(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function clear() {
    setItems([]);
  }

  return { items, ready, monthlyTotal, add, update, remove, clear };
}
