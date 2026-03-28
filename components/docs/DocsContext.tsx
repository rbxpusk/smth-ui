"use client";
import { createContext, useContext, useState, useEffect } from "react";
import type { TocItem } from "@/lib/docs/types";

interface TocContextValue {
  items: TocItem[];
  setItems: (items: TocItem[]) => void;
}

const TocContext = createContext<TocContextValue>({
  items: [],
  setItems: () => {},
});

export function TocProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<TocItem[]>([]);
  return (
    <TocContext.Provider value={{ items, setItems }}>
      {children}
    </TocContext.Provider>
  );
}

/** Call this from a docs page to register TOC items for the right-hand panel. */
export function useToc(items: TocItem[]) {
  const { setItems } = useContext(TocContext);
  const key = JSON.stringify(items);
  useEffect(() => {
    setItems(items);
    return () => setItems([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

export function useTocItems(): TocItem[] {
  return useContext(TocContext).items;
}
