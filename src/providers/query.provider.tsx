"use client";

import { useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { getQueryClient } from "@/lib/api/query-client";

function logQueryProviderError(scope: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  const trace = error instanceof Error ? error.stack : undefined;
  console.warn(`[query.provider][error][${scope}] ${message}`);
  if (trace) console.error(trace);
}

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState<QueryClient>(() => {
    try {
      // [crash-test] simulate QueryClient initialization failure
      // throw new Error("[crash-test] QueryProvider.getQueryClient");

      return getQueryClient();
    } catch (error) {
      logQueryProviderError("getQueryClient", error);
      return new QueryClient();
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
