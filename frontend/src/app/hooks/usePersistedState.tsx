import { useSyncExternalStore } from "react";
import { getItem, setItem } from "../helpers/localStorage";
const STORAGE_CHANGE_EVENT = "app-storage-change";

export function usePersistedState<T>(key: string, initialValue: T) {
  function subscribe(callback: () => void) {
    const handleStorageChange = (e: Event) => {
      if (e instanceof StorageEvent && e.key !== null && e.key !== key) {
        return;
      }
      callback();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(STORAGE_CHANGE_EVENT, handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(STORAGE_CHANGE_EVENT, handleStorageChange);
    };
  }

  function getSnapshot() {
    const item = getItem(key);
    return item !== undefined ? item : initialValue;
  }

  function getServerSnapshot() {
    return initialValue;
  }

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function setValue(newValue: T | ((prev: T) => T)) {
    const valueToStore =
      newValue instanceof Function
        ? newValue(getItem(key) ?? initialValue)
        : newValue;

    setItem(key, valueToStore);
    window.dispatchEvent(new CustomEvent(STORAGE_CHANGE_EVENT));
  }

  return [value, setValue] as const;
}
