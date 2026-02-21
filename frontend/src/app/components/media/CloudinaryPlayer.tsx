"use client";
import { useImperativeHandle, forwardRef } from "react";
import { Lesson } from "../../Types";
import LoopButtons from "./LoopButtons";
import Box from "@mui/material/Box";
import { VideoPlayerRef } from "./playerTypes";
import SpeedControl from "./SpeedControl";
import VolumeControl from "./VolumeControl";
import "cloudinary-video-player/cld-video-player.min.css";
import useCloudinaryLoop from "../../hooks/useCloudinaryLoop";
import CloudinaryPlayerError from "./CloudinaryPlayerError";
import CloudinaryPlayerContainer from "./CloudinaryPlayerContainer";
import { useVolume } from "@/app/hooks/useVolume";
import useCloudinaryPlayer from "@/app/hooks/useCloudinaryPlayer";

interface CloudinaryPlayerProps {
  selectedLesson: Lesson | undefined;
}

const CloudinaryPlayer = forwardRef<VideoPlayerRef, CloudinaryPlayerProps>(
  function CloudinaryPlayer({ selectedLesson }, ref) {
    const {
      handleSpeedChange,
      playbackRate,
      isReady,
      seekTo,
      duration,
      hasError,
      videoRef,
      playerRef,
    } = useCloudinaryPlayer(selectedLesson?.cloudinary_public_id);
    const { state, setRange, toggleLoop, clearLoop } =
      useCloudinaryLoop(playerRef);
    const { handleMuteToggle, handleVolumeChange, volume, muted } =
      useVolume(videoRef);

    const isLooping = state.status === "looping";
    const startTime = state.status === "idle" ? null : state.startTime;
    const endTime =
      state.status === "idle" || state.status === "start_set"
        ? null
        : state.endTime;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useImperativeHandle(ref, () => playerRef.current!, [playerRef.current]);

    return (
      <>
        {hasError ? (
          <CloudinaryPlayerError />
        ) : (
          <CloudinaryPlayerContainer>
            <Box
              sx={{
                "& video": {
                  display: "block",
                  width: "100%",
                  aspectRatio: "16/9",
                },
                "& .cld-video-player": {
                  width: "100%",
                },
              }}
            >
              <video
                ref={videoRef}
                className="cld-video-player cld-fluid"
                style={{ width: "100%" }}
              />
            </Box>
            <Box
              sx={{
                p: 1.5,
                bgcolor: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexWrap: "wrap",
              }}
            >
              <LoopButtons
                startTime={startTime}
                endTime={endTime}
                isLooping={isLooping}
                duration={duration}
                setRange={setRange}
                seekTo={seekTo}
                toggleLoop={toggleLoop}
                clearLoop={clearLoop}
              />
              <VolumeControl
                volume={volume}
                muted={muted}
                onVolumeChange={handleVolumeChange}
                onMuteToggle={handleMuteToggle}
                disabled={!isReady}
              />
              <Box sx={{ ml: "auto" }}>
                <SpeedControl
                  speed={playbackRate}
                  onSpeedChange={handleSpeedChange}
                  disabled={!isReady}
                />
              </Box>
            </Box>
          </CloudinaryPlayerContainer>
        )}
      </>
    );
  }
);

export default CloudinaryPlayer;
