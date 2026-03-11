import { usePersistedState } from "./usePersistedState";

export default function useFontSize() {
  const [fontSize, setFontSize] = usePersistedState("fontSize", 1.3);
  function increaseFontSize() {
    setFontSize((prev) => Math.min(prev + 0.1, 2));
  }
  function decreaseFontSize() {
    setFontSize((prev) => Math.max(prev - 0.1, 0.8));
  }
  return { fontSize, increaseFontSize, decreaseFontSize };
}
