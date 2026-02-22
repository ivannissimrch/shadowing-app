"use client";
import { useRef, useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { FiPlus, FiSave, FiRotateCcw } from "react-icons/fi";
import useAudioSegmenter from "@/app/hooks/useAudioSegmenter";
import WaveformPlayer, { type WaveformPlayerRef } from "./WaveformPlayer";
import SegmentList from "./SegmentList";

interface AudioSegmenterProps {
  lessonId: string;
  audioUrl: string;
}

export default function AudioSegmenter({
  lessonId,
  audioUrl,
}: AudioSegmenterProps) {
  const t = useTranslations("segments");
  const waveformRef = useRef<WaveformPlayerRef>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const {
    segments,
    isSaving,
    saveError,
    saveSuccess,
    addSegment,
    updateSegmentLabel,
    updateSegmentTimes,
    removeSegment,
    saveSegments,
    resetSegments,
  } = useAudioSegmenter(lessonId);

  const handleAddSegment = useCallback(() => {
    const time = waveformRef.current?.getCurrentTime() ?? 0;
    const duration = waveformRef.current?.getDuration() ?? 0;
    const endTime = Math.min(time + 3, duration);
    const id = `new-${Date.now()}`;
    addSegment(id, time, endTime);
    setValidationError(null);
  }, [addSegment]);

  const handleSave = useCallback(async () => {
    // Validate all segments have labels before sending to API
    const hasEmptyLabel = segments.some((s) => !s.label.trim());
    if (hasEmptyLabel) {
      setValidationError(t("emptyLabelsError"));
      return;
    }
    setValidationError(null);
    await saveSegments();
  }, [segments, saveSegments, t]);

  const [playingSegmentId, setPlayingSegmentId] = useState<string | null>(null);

  const handlePlaySegment = useCallback((id: string) => {
    const wf = waveformRef.current;
    if (!wf) return;

    // If this segment is already playing, stop it
    if (playingSegmentId === id && wf.isPlaying()) {
      wf.stop();
      setPlayingSegmentId(null);
      return;
    }

    // Stop any current playback, play the new segment
    wf.stop();
    wf.playRegion(id);
    setPlayingSegmentId(id);
  }, [playingSegmentId]);

  const errorMessage = validationError || (saveError ? t(saveError) : null);

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        {t("phraseBuilder")}
      </Typography>

      <WaveformPlayer
        ref={waveformRef}
        audioUrl={audioUrl}
        segments={segments}
        onRegionUpdated={updateSegmentTimes}
        onPlaybackEnd={() => setPlayingSegmentId(null)}
      />

      {/* Action buttons */}
      <Box sx={{ display: "flex", gap: 1, mt: 2, mb: 2, flexWrap: "wrap" }}>
        <Button
          variant="outlined"
          startIcon={<FiPlus size={16} />}
          onClick={handleAddSegment}
          sx={{ textTransform: "none" }}
        >
          {t("addSegment")}
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button
          variant="outlined"
          startIcon={<FiRotateCcw size={16} />}
          onClick={resetSegments}
          disabled={isSaving}
          sx={{ textTransform: "none" }}
        >
          {t("reset")}
        </Button>
        <Button
          variant="contained"
          startIcon={
            isSaving ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <FiSave size={16} />
            )
          }
          onClick={handleSave}
          disabled={isSaving || segments.length === 0}
          sx={{ textTransform: "none" }}
        >
          {isSaving ? t("saving") : t("saveSegments")}
        </Button>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {t("segmentsSaved")}
        </Alert>
      )}

      <SegmentList
        segments={segments}
        onLabelChange={updateSegmentLabel}
        onDelete={removeSegment}
        onPlay={handlePlaySegment}
        playingSegmentId={playingSegmentId}
        t={t}
      />
    </Box>
  );
}
