"use client";
import { useState, useEffect } from "react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { useAppContext } from "../AppContext";

export default function useFetchData<T>(endpoint: string): {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { token } = useAppContext();

  useEffect(() => {
    async function loadData() {
      try {
        if (!token) {
          return;
        }
        setIsLoading(true);
        const response = await fetch(`${API_URL}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        setError(error as Error);
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [token, endpoint]);

  return { data, isLoading, error };
}
