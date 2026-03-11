import { useState } from "react";

export default function useVideoPhrasesToggle() {
  const [isVideoVisible, setIsVideoVisible] = useState(true);

  function toggleVideoPhrases(_: React.MouseEvent, value: string | null) {
    if (value === null) return;
    setIsVideoVisible(value === "video");
  }
  return { isVideoVisible, toggleVideoPhrases };
}
