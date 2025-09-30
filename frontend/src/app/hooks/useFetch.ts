import useSWR from "swr";
import { useAppContext } from "../AppContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useFetch<T>(endpoint: string) {
  const { token } = useAppContext();

  const { data, error, mutate } = useSWR<T>(
    token ? `${API_URL}${endpoint}` : null,
    (url: string) =>
      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Error fetching data");
          }
          return res.json();
        })
        .then((result) => result.data),
    { suspense: true }
  );

  return { data, error, mutate };
}
