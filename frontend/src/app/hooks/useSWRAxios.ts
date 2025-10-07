import useSWR, { SWRConfiguration } from "swr";
import api from "../helpers/axiosFetch";
import type { ApiResponse } from "../Types";

export function useSWRAxios<T>(
  endpoint: string | null,
  config?: SWRConfiguration
) {
  // Only enable Suspense on client side (not during SSR)
  const isClient = typeof window !== "undefined";

  const { data, error, mutate, isValidating } = useSWR<T>(
    endpoint,
    async (url: string) => {
      const response = await api.get<ApiResponse<T>>(url);
      return response.data.data;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      suspense: isClient, // Only true on client, false on server
      shouldRetryOnError: true,
      ...config,
    }
  );

  return {
    data,
    error,
    isLoading: !error && !data,
    isValidating,
    mutate,
  };
}
