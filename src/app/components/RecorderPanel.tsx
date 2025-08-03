"use client";
import Link from "next/link";
import styles from "./RecorderPanel.module.css";
import { useState, useRef } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

export default function RecorderPanel() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);

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
      setBlob(blob);
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

  function handleSubmit() {
    if (!blob) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64Audio = reader.result;
      console.log("Base64 audio string:", base64Audio);
      // send base64Audio to localStorage or supabase
      // localStorage.setItem("audio", base64Audio as string);
      // or use supabase client to upload the audio blob
      // supabase.storage.from("audio").upload("lesson-audio.webm", blob);
      //show a success message or handle the submission
      //mark the lesson as submitted
      //navigate to home page
    };
  }

  return (
    <div className={styles.panel}>
      {!audioURL && (
        <>
          {" "}
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
        </>
      )}
      {audioURL && (
        <div className={styles.MediaRecorder}>
          <AudioPlayer autoPlay src={audioURL} showJumpControls={false} />
          <button
            className={styles.recordBtn}
            onClick={() => setAudioURL(null)}
          >
            Delete
          </button>
          <Link href="/" className={styles.recordBtn} onClick={handleSubmit}>
            Submit
          </Link>
        </div>
      )}
    </div>
  );
}
