"use client";
import styles from "./RecorderPanel.module.css";
import { useState, useRef } from "react";

export default function RecorderPanel() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    audioChunks.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(audioChunks.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);

      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64Audio = reader.result;
        console.log("Base64 audio string:", base64Audio);
        //send base64Audio to localStorage
      };
    };

    mediaRecorder.start();
    setRecording(true);
    setPaused(false);
  }

  function pauseRecording() {
    mediaRecorderRef.current?.pause();
    setPaused(true);
  }

  function resumeRecording() {
    mediaRecorderRef.current?.resume();
    setPaused(false);
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    setPaused(false);
  }

  return (
    <div className={styles.panel}>
      <div className={styles.mic}>
        <span className={styles.icon}>🎙️</span>
        {!recording ? <p>Ready to record</p> : <p>Recording...</p>}
        {!recording && (
          <button onClick={startRecording} className={styles.recordBtn}>
            Start Recording
          </button>
        )}
        {recording && !paused && (
          <button className={styles.recordBtn} onClick={pauseRecording}>
            Pause
          </button>
        )}
        {recording && paused && (
          <button onClick={resumeRecording} className={styles.recordBtn}>
            Resume
          </button>
        )}
        {recording && (
          <button onClick={stopRecording} className={styles.recordBtn}>
            Stop
          </button>
        )}
      </div>
      {audioURL && (
        <div className="mt-4">
          <p className="text-sm font-medium">Playback:</p>
          <audio src={audioURL} controls className="w-full mt-1" />
        </div>
      )}
    </div>
  );
}
