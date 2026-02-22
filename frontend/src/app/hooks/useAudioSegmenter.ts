import { useState, useEffect, useCallback } from "react";
import { useSWRAxios } from "./useSWRAxios";
import { API_PATHS } from "../constants/apiKeys";
import api from "../helpers/axiosFetch";
import type { AudioSegment } from "../Types";

export interface LocalSegment {
  id: string;
  label: string;
  start_time: number;
  end_time: number;
  position: number;
}

export default function useAudioSegmenter(lessonId: string) {
  const { data: savedSegments, mutate } = useSWRAxios<AudioSegment[]>(
    API_PATHS.LESSON_SEGMENTS(lessonId)
  );

  const [segments, setSegments] = useState<LocalSegment[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize local state from fetched data
  useEffect(() => {
    if (savedSegments) {
      setSegments(
        savedSegments.map((s) => ({
          id: s.id,
          label: s.label,
          start_time: s.start_time,
          end_time: s.end_time,
          position: s.position,
        }))
      );
    }
  }, [savedSegments]);

  const addSegment = useCallback(
    (id: string, startTime: number, endTime: number) => {
      setSegments((prev) => {
        const newSegment: LocalSegment = {
          id,
          label: "",
          start_time: Math.round(startTime * 100) / 100,
          end_time: Math.round(endTime * 100) / 100,
          position: prev.length + 1,
        };
        const updated = [...prev, newSegment].sort(
          (a, b) => a.start_time - b.start_time
        );
        return updated.map((s, i) => ({ ...s, position: i + 1 }));
      });
      setSaveSuccess(false);
    },
    []
  );

  const updateSegmentLabel = useCallback((id: string, label: string) => {
    setSegments((prev) =>
      prev.map((s) => (s.id === id ? { ...s, label } : s))
    );
    setSaveSuccess(false);
  }, []);

  const updateSegmentTimes = useCallback(
    (id: string, startTime: number, endTime: number) => {
      setSegments((prev) => {
        const updated = prev.map((s) =>
          s.id === id
            ? {
                ...s,
                start_time: Math.round(startTime * 100) / 100,
                end_time: Math.round(endTime * 100) / 100,
              }
            : s
        );
        updated.sort((a, b) => a.start_time - b.start_time);
        return updated.map((s, i) => ({ ...s, position: i + 1 }));
      });
      setSaveSuccess(false);
    },
    []
  );

  const removeSegment = useCallback((id: string) => {
    setSegments((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      return filtered.map((s, i) => ({ ...s, position: i + 1 }));
    });
    setSaveSuccess(false);
  }, []);

  const saveSegments = useCallback(async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      await api.post(API_PATHS.TEACHER_LESSON_SEGMENTS(lessonId), {
        segments: segments.map((s) => ({
          label: s.label,
          start_time: s.start_time,
          end_time: s.end_time,
          position: s.position,
        })),
      });

      // Re-fetch to get server-assigned IDs
      await mutate();
      setSaveSuccess(true);
    } catch {
      setSaveError("saveFailed");
    } finally {
      setIsSaving(false);
    }
  }, [lessonId, segments, mutate]);

  const resetSegments = useCallback(() => {
    if (savedSegments) {
      setSegments(
        savedSegments.map((s) => ({
          id: s.id,
          label: s.label,
          start_time: s.start_time,
          end_time: s.end_time,
          position: s.position,
        }))
      );
    } else {
      setSegments([]);
    }
    setSaveSuccess(false);
    setSaveError(null);
  }, [savedSegments]);

  return {
    segments,
    isSaving,
    saveError,
    saveSuccess,
    isLoaded: savedSegments !== undefined,
    addSegment,
    updateSegmentLabel,
    updateSegmentTimes,
    removeSegment,
    saveSegments,
    resetSegments,
  };
}
