import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Build URL from queryKey supporting patterns like
    // ["/api/transactions", { limit: 5 }] or ["/api/transactions/monthly-stats", { year, month }]
    let url: string;
    if (Array.isArray(queryKey) && typeof queryKey[0] === "string") {
      url = queryKey[0] as string;
      const params = queryKey[1];
      if (params && typeof params === "object" && !Array.isArray(params)) {
        const qs = new URLSearchParams();
        Object.entries(params as Record<string, unknown>).forEach(([key, value]) => {
          if (value !== undefined && value !== null) qs.append(key, String(value));
        });
        const queryString = qs.toString();
        if (queryString) url += `?${queryString}`;
      }
    } else {
      // Fallback to previous behavior
      url = (queryKey as unknown as string[]).join("/");
    }

    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
