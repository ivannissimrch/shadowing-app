import { useEffect } from "react";
import { useState } from "react";
import { getItem, setItem } from "../helpers/localStorage";

export function usePersistedState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const item = getItem(key);
    if (item !== undefined) {
      setValue(item);
    }
    setIsLoaded(true);
  }, [key]);

  useEffect(() => {
    if (isLoaded) {
      setItem(key, value);
    }
  }, [value, key, isLoaded]);

  return [value, setValue] as const;
}
