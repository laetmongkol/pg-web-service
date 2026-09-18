"use client";

import { QueryProvider, ThemeSyncProvider } from "@/providers";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeSyncProvider>
        {children}
      </ThemeSyncProvider>
    </QueryProvider>
  );
}
