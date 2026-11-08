
"use client";

import { prettifyKey } from "@/utils/utils";
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

interface UseFetchOptions<T> {
  auto?: boolean;
  url?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  payload?: any;
  headers?: Record<string, string>;
  withAuth?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  showErrorToast?: boolean;
}

interface UseFetchReturn<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  refetch: (overrideOptions?: Partial<UseFetchOptions<T>>) => Promise<void>;
}

export default function useFetch<T = any>({
  auto = false,
  url = "",
  method = "GET",
  payload = null,
  headers = {},
  withAuth = true,
  onSuccess = () => {},
  onError = () => {},
  showErrorToast = true,
}: UseFetchOptions<T> = {}): UseFetchReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const latestConfigRef = useRef<UseFetchOptions<T>>({
    url,
    method,
    payload,
    headers,
    withAuth,
    onSuccess,
    onError,
    showErrorToast,
  });

  useEffect(() => {
    latestConfigRef.current = {
      url,
      method,
      payload,
      headers,
      withAuth,
      onSuccess,
      onError,
      showErrorToast,
    };
  }, [url, method, payload, headers, withAuth, onSuccess, onError, showErrorToast]);

  const refetch = useCallback(
    async (overrideOptions: Partial<UseFetchOptions<T>> = {}) => {
      const config = {
        ...latestConfigRef.current,
        ...overrideOptions,
      };

      if (!config.url) return;

      setIsLoading(true);
      setError(null);

      try {
        const finalHeaders = { ...config.headers };

        const isFormData = config.payload instanceof FormData;

        if (!isFormData && config.method !== "GET") {
          finalHeaders["Content-Type"] = "application/json";
        }

        const fetchOptions: RequestInit = {
          method: config.method,
          headers: finalHeaders,
          body:
            config.method !== "GET"
              ? isFormData
                ? config.payload
                : JSON.stringify(config.payload)
              : undefined,
        };

        if (config.withAuth) {
          fetchOptions.credentials = "include";
        }

        const response = await fetch(config.url, fetchOptions);

        const isJson = response.headers
          .get("content-type")
          ?.includes("application/json");

        const result = isJson
          ? await response.json()
          : await response.text();

        if (!response.ok) {
          throw {
            message:
              result?.error?.message ||
              result?.message ||
              "Something went wrong",
            fullError: result?.error,
            status: response.status,
          };
        }

        setData(result as T);
        config.onSuccess?.(result as T);
      } catch (err: any) {
        const message = err?.message || "Unknown error";

        if (config.showErrorToast) {
          const errMessage = message.charAt(0).toUpperCase() + message.slice(1);
          toast.error(errMessage);
        }
        setError(message);
        config.onError?.(err?.fullError || err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (auto && url) {
      refetch();
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    error,
    isLoading,
    refetch,
  };
}
