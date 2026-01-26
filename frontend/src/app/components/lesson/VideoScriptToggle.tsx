import SegmentPlayer from "../media/SegmentPlayer";
import { Lesson } from "@/app/Types";
import { useState } from "react";
import ToggleButtons from "./ToggleButtons";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

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
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          mb: 2,
        }}
      >
        {/* Video section */}
        {(toggleState === ToggleState.SHOW_BOTH ||
          toggleState === ToggleState.SHOW_VIDEO_ONLY) && (
          <Paper sx={{ overflow: "hidden", borderRadius: 2 }}>
            <SegmentPlayer selectedLesson={selectedLesson} />
          </Paper>
        )}

        {/* Script/Image section */}
        {(toggleState === ToggleState.SHOW_BOTH ||
          toggleState === ToggleState.SHOW_SCRIPT_ONLY) && (
          <Paper
            sx={{
              overflow: "hidden",
              borderRadius: 2,
              maxWidth: toggleState === ToggleState.SHOW_SCRIPT_ONLY ? 800 : "100%",
              mx: toggleState === ToggleState.SHOW_SCRIPT_ONLY ? "auto" : 0,
            }}
          >
            <Box
              component="img"
              src={selectedLesson.image}
              alt={`${selectedLesson.title} Practice lesson image`}
              sx={{
                width: "100%",
                height: "auto",
                display: "block",
                maxHeight: "70vh",
                objectFit: "contain",
              }}
            />
          </Paper>
        )}
      </Box>

      <ToggleButtons
        toggleState={toggleState}
        updateToggleState={updateToggleState}
      />
    </Box>
  );
}
