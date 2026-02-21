import { useState, useCallback, RefObject } from "react";

export function useVolume(videoRef: RefObject<HTMLVideoElement | null>) {
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  const handleVolumeChange = useCallback(
    (newVolume: number) => {
      if (videoRef.current) {
        videoRef.current.volume = newVolume;
        videoRef.current.muted = newVolume === 0;
        setVolume(newVolume);
        setMuted(newVolume === 0);
      }
    },
    [videoRef]
  );

  const handleMuteToggle = useCallback(() => {
    if (videoRef.current) {
      const newMuted = !videoRef.current.muted;
      videoRef.current.muted = newMuted;
      setMuted(newMuted);
    }
  }, [videoRef]);

  return { handleMuteToggle, handleVolumeChange, volume, muted };
}
