"use client";

import { useEffect } from "react";

interface TrackServerDataProps {
  /** Key this data is stored under inside sessionStorage's merged object, e.g. "blog:article". */
  label: string;
  data: unknown;
}

/**
 * Dev-only debug aid: dumps server-fetched data into `sessionStorage.__server_data__`
 * (merged object, keyed by `label`) so it's inspectable from devtools without adding
 * console.log noise. No-op outside development.
 *
 * Runs via useEffect, not an inline <script> — React 19 doesn't execute inline scripts
 * inserted during client-side rendering (soft navigation), only on a real HTML parse.
 */
const TrackServerData = ({ label, data }: TrackServerDataProps) => {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const KEY = "__server_data__";
    let store: Record<string, unknown> = {};
    try {
      store = JSON.parse(sessionStorage.getItem(KEY) ?? "{}");
    } catch {
      store = {};
    }

    const win = window as typeof window & { __server_data_reset__?: boolean };
    const [navigationEntry] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    const isReload = navigationEntry?.type === "reload";
    if (isReload && !win.__server_data_reset__) {
      store = {};
      win.__server_data_reset__ = true;
    }

    store[label] = data;
    sessionStorage.setItem(KEY, JSON.stringify(store));
  }, [label, data]);

  return null;
};

export default TrackServerData;
