"use client";
import RecorderPanel from "../media/RecorderPanel";
import { Lesson } from "../../Types";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { API_PATHS } from "../../constants/apiKeys";
import RecorderPanelContextProvider from "@/app/RecorderpanelContext";
import VideoScriptToggle from "./VideoScriptToggle";

export function LessonPracticeView({ id }: { id: string }) {
  const { data: selectedLesson } = useSWRAxios<Lesson>(API_PATHS.LESSON(id));

  return (
    <>
      {selectedLesson && (
        <RecorderPanelContextProvider selectedLesson={selectedLesson}>
          <VideoScriptToggle
            selectedLesson={selectedLesson}
            belowVideo={<RecorderPanel selectedLesson={selectedLesson} />}
          />
        </RecorderPanelContextProvider>
      )}
    </>
  );
}
