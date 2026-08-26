import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

import { successToast } from "@/components/toasts";

import { calculateTime } from "../format/time-calculator";

function logQueryClientError(scope: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  const trace = error instanceof Error ? error.stack : undefined;
  console.log(`[query-client][error][${scope}] ${message}`);
  if (trace) console.log(trace);
}

/**
 * Success toasts are opt-in per query/mutation. Errors are not handled here at all — every caller
 * toasts its own failure, so a request that wants no toast simply says nothing.
 */
interface QueryMeta {
  successTitle?: string;
  successMessage?: string;
}

const DEFAULT_SUCCESS_TITLE = "Success";

const handleSuccess = (meta: QueryMeta | undefined) => {
  try {
    // [crash-test] simulate success toast failure
    // throw new Error("[crash-test] handleSuccess");

    if (!meta?.successTitle && !meta?.successMessage) return;

    successToast({
      title: meta.successTitle ?? DEFAULT_SUCCESS_TITLE,
      message: meta.successMessage,
    });
  } catch (error) {
    logQueryClientError("handleSuccess", error);
  }
};

const createQueryClient = () => {
  try {
    // [crash-test] simulate QueryClient creation failure
    // throw new Error("[crash-test] createQueryClient");

    return new QueryClient({
    queryCache: new QueryCache({
      onSuccess: (_data, query) => handleSuccess(query.meta as QueryMeta | undefined),
    }),
    mutationCache: new MutationCache({
      onSuccess: (_data, _variables, _context, mutation) =>
        handleSuccess(mutation.meta as QueryMeta | undefined),
    }),
    defaultOptions: {
      queries: {
        // Don't hammer 4xx/5xx — the caller sees the final failure and decides what to show.
        retry: (failureCount, error) => {
          const status =
            typeof error === "object" &&
            error !== null &&
            "response" in error &&
            (error as { response?: Response }).response instanceof Response
              ? (error as { response: Response }).response.status
              : undefined;
          if (status !== undefined && status < 500) return false;
          return failureCount < 1;
        },
        retryDelay: (attempt) => Math.min(calculateTime({ second: 1 }) * 2 ** attempt, 3000),
        staleTime: calculateTime({ minute: 1 }),
        gcTime: calculateTime({ minute: 5 }),
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: true,
        networkMode: "online",
        throwOnError: false,
      },
      mutations: {
        retry: 0,
        networkMode: "online",
        throwOnError: false,
        meta: {},
      },
    },
  });
  } catch (error) {
    logQueryClientError("createQueryClient", error);
    return new QueryClient();
  }
};

let browserQueryClient: QueryClient | undefined;

export const getQueryClient = (): QueryClient => {
  try {
    // [crash-test] simulate getQueryClient failure
    // throw new Error("[crash-test] getQueryClient");

    if (typeof window === "undefined") {
      return createQueryClient();
    }

    if (!browserQueryClient) {
      browserQueryClient = createQueryClient();
    }

    return browserQueryClient;
  } catch (error) {
    logQueryClientError("getQueryClient", error);
    return new QueryClient();
  }
};
