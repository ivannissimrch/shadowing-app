// Common interface for video players (YouTube and Cloudinary)
export interface VideoPlayerRef {
  getCurrentTime: () => number;
  seekTo: (time: number) => void;
  getDuration: () => number;
  play: () => void;
  pause: () => void;
  setPlaybackRate?: (rate: number) => void;
  getPlaybackRate?: () => number;
}
