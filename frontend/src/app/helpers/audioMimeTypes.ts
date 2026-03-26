/**
 * Cross-platform audio recording with iOS/iPhone support
 * Based on Gemini's recommendation for iPhone compatibility
 */

// Gemini's universal MIME type detection - audio version
export const getSupportedMimeType = () => {
  const types = [
    'audio/mp4',                // Top pick for iOS/Safari
    'audio/webm;codecs=opus',   // Top pick for Chrome/Android/PC
    'audio/webm',              // Chrome fallback
    'audio/mpeg'               // iOS fallback
  ];
  return types.find(type => MediaRecorder.isTypeSupported(type)) || '';
};

// Gemini's complete recorder configuration
export const getMediaRecorderOptions = () => {
  const mimeType = getSupportedMimeType();
  return mimeType ? { mimeType } : undefined;
};

export const getBlobPropertyBag = () => {
  const mimeType = getSupportedMimeType();
  return mimeType ? { type: mimeType } : undefined;
};

// Gemini's iOS audio context fix
export const resumeAudioContextForIOS = async () => {
  // Safari fix: Resume audio context on user gesture
  if (window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const context = new AudioCtx();
    if (context.state === 'suspended') {
      await context.resume();
    }
  }
};

// Create blob URL with proper MIME type for iPhone compatibility
export const createAudioBlobUrl = (blob: Blob) => {
  const mimeType = getSupportedMimeType();
  const audioBlob = new Blob([blob], { type: mimeType });
  return URL.createObjectURL(audioBlob);
};