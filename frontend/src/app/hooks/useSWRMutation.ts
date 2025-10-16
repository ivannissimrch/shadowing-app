import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";
import api from "../helpers/axiosFetch";
import type { ApiResponse } from "../Types";
import { AxiosRequestConfig } from "axios";

type MutationMethod = "POST" | "PUT" | "PATCH" | "DELETE";

interface MutationOptions extends AxiosRequestConfig {
  method?: MutationMethod;
}

export function useSWRMutationHook<TData, TVariables = unknown>(
  endpoint: string | null,
  options?: MutationOptions,
  config?: SWRMutationConfiguration<TData, unknown, string, TVariables>
) {
  const method = options?.method || "POST";

  const { trigger, isMutating, error, data, reset } = useSWRMutation<
    TData,
    unknown,
    string | null,
    TVariables
  >(
    endpoint,
    async (url: string, { arg }: { arg: TVariables }) => {
      // Only pass options as config, don't duplicate arg in config.data
      const requestConfig: AxiosRequestConfig = {
        ...options,
      };

      let response;
      switch (method) {
        case "POST":
          response = await api.post<ApiResponse<TData>>(
            url,
            arg,
            requestConfig
          );
          break;
        case "PUT":
          response = await api.put<ApiResponse<TData>>(url, arg, requestConfig);
          break;
        case "PATCH":
          response = await api.patch<ApiResponse<TData>>(
            url,
            arg,
            requestConfig
          );
          break;
        case "DELETE":
          response = await api.delete<ApiResponse<TData>>(url, requestConfig);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      return response.data.data;
    },
    {
      throwOnError: false,
      ...config,
    }
  );

  return {
    trigger,
    isMutating,
    error,
    data,
    reset,
  };
}
