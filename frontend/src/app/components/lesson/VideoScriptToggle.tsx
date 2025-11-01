import styles from "./LessonPracticeView.module.css";
import SegmentPlayer from "../media/SegmentPlayer";
import Image from "next/image";
import { Lesson } from "@/app/Types";
import { useState } from "react";
import ToggleButtons from "./ToggleButtons";

export enum ToggleState {
  SHOW_BOTH,
  SHOW_VIDEO_ONLY,
  SHOW_SCRIPT_ONLY,
}

export default function VideoScriptToggle({
  selectedLesson,
}: {
  selectedLesson: Lesson;
}) {
  const [toggleState, setToggleState] = useState<ToggleState>(
    ToggleState.SHOW_BOTH
  );

  function updateToggleState(newState: ToggleState) {
    setToggleState(newState);
  }

  return (
    <div
      className={
        toggleState === ToggleState.SHOW_BOTH
          ? styles.grid
          : styles.gridOneColumn
      }
    >
      {toggleState === ToggleState.SHOW_BOTH && (
        <>
          <SegmentPlayer selectedLesson={selectedLesson} />{" "}
          <Image
            src={selectedLesson.image}
            alt={`${selectedLesson.title}  Practice lesson image`}
            quality={100}
            width={1400}
            height={875}
            priority
          />
        </>
      )}

      {toggleState === ToggleState.SHOW_VIDEO_ONLY && (
        <SegmentPlayer selectedLesson={selectedLesson} />
      )}
      {toggleState === ToggleState.SHOW_SCRIPT_ONLY && (
        <Image
          src={selectedLesson.image}
          alt={`${selectedLesson.title}  Practice lesson image`}
          quality={100}
          width={1400}
          height={875}
          priority
        />
      )}
      <ToggleButtons
        toggleState={toggleState}
        updateToggleState={updateToggleState}
      />
    </div>
  );
}
